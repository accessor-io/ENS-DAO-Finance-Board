#!/usr/bin/env python3
import json
import csv
import time
import re
import sys
import os
import math
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from html import unescape

BASE_URL = "https://discuss.ens.domains"
USER_AGENT = "ENS-Finance-Scraper/1.0 (+https://discuss.ens.domains)"
OUTPUT_DIR = "/workspace/output"
REQUEST_TIMEOUT_S = 20
RATE_LIMIT_S = 0.6
MAX_PAGES_PER_SOURCE = 5

FINANCE_KEYWORDS = [
	"finance", "financial", "budget", "treasury", "grant", "grants", "funding",
	"revenue", "expense", "expenditure", "spend", "spending", "audit",
	"report", "monthly", "quarterly", "annual", "accounting", "operations",
	"compensation", "salary", "payroll", "vesting", "multisig", "USDC", "DAI", "ETH",
]

TAG_KEYWORD_HINTS = [
	"finance", "financial", "treasury", "budget", "grant", "grants", "fund", "funding",
	"report", "ops", "operations", "dao", "compensation", "payroll", "audit",
]

CATEGORY_KEYWORD_HINTS = [
	"finance", "financial", "treasury", "budget", "operations", "ops", "report",
]

AMOUNT_PATTERNS = [
	# $ amounts with optional commas/decimals and multipliers
	re.compile(r"\$\s?([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)(?:\.[0-9]+)?\s?(million|billion|thousand|k|m|b)?", re.IGNORECASE),
	# USD amounts like 1.2m USD, 500k usd
	re.compile(r"([0-9]+(?:\.[0-9]+)?)\s?(k|m|b|thousand|million|billion)?\s?\b(USD|USDC|USDT|DAI)\b", re.IGNORECASE),
	# Crypto token with value preceding tickers: 1,234.56 ETH
	re.compile(r"([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+(?:\.[0-9]+)?)\s?\b(ETH|WETH|stETH|ENS|WBTC|BTC)\b", re.IGNORECASE),
	# Token first then amount: ETH 1.23m
	re.compile(r"\b(ETH|WETH|stETH|ENS|WBTC|BTC)\b\s?([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+(?:\.[0-9]+)?)(\s?(k|m|b|thousand|million|billion))?", re.IGNORECASE),
]

SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+|(?<=\n)\n+", re.MULTILINE)
TAG_STRIPPER = re.compile(r"<[^>]+>")
WHITESPACE_NORM = re.compile(r"\s+")


def http_get_json(path: str):
	url = path if path.startswith("http") else f"{BASE_URL}{path}"
	req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
	for attempt in range(3):
		try:
			with urlopen(req, timeout=REQUEST_TIMEOUT_S) as resp:
				content = resp.read().decode("utf-8", errors="ignore")
				return json.loads(content)
		except HTTPError as e:
			if e.code == 429:
				time.sleep(2 + attempt)
				continue
			if 500 <= e.code < 600:
				time.sleep(1 + attempt)
				continue
			print(f"HTTP error {e.code} for {url}", file=sys.stderr)
			return None
		except URLError as e:
			time.sleep(1 + attempt)
			continue
		except Exception as e:
			print(f"Error fetching {url}: {e}", file=sys.stderr)
			time.sleep(1 + attempt)
	return None


def strip_html(html: str) -> str:
	if not html:
		return ""
	text = TAG_STRIPPER.sub(" ", html)
	text = unescape(text)
	text = WHITESPACE_NORM.sub(" ", text)
	return text.strip()


def split_sentences(text: str):
	if not text:
		return []
	return [s.strip() for s in SENTENCE_SPLIT.split(text) if s and s.strip()]


def normalize_multiplier(mult: str) -> float:
	if not mult:
		return 1.0
	m = mult.lower()
	if m in ("k", "thousand"):
		return 1_000.0
	if m in ("m", "million"):
		return 1_000_000.0
	if m in ("b", "billion"):
		return 1_000_000_000.0
	return 1.0


def parse_amounts(text: str):
	results = []
	if not text:
		return results
	for pattern in AMOUNT_PATTERNS:
		for match in pattern.finditer(text):
			groups = match.groups()
			amount_value = None
			currency = None
			amount_text = match.group(0)

			# Interpret groups per pattern
			try:
				if pattern is AMOUNT_PATTERNS[0]:
					num_str, mult = groups
					num_clean = num_str.replace(",", "")
					amount_value = float(num_clean) * normalize_multiplier(mult)
					currency = "USD"
				elif pattern is AMOUNT_PATTERNS[1]:
					num_str, mult, curr = groups
					amount_value = float(num_str) * normalize_multiplier(mult)
					currency = curr.upper()
				elif pattern is AMOUNT_PATTERNS[2]:
					num_str, curr = groups
					num_clean = num_str.replace(",", "")
					amount_value = float(num_clean)
					currency = curr.upper()
				elif pattern is AMOUNT_PATTERNS[3]:
					curr, num_str, mult = groups[0], groups[1], groups[2]
					num_clean = num_str.replace(",", "")
					amount_value = float(num_clean) * normalize_multiplier(mult.strip() if mult else None)
					currency = curr.upper()
			except Exception:
				continue

			if amount_value is not None and math.isfinite(amount_value):
				results.append({
					"amount_value": amount_value,
					"currency": currency,
					"amount_text": amount_text,
				})
	return results


def gather_tags():
	data = http_get_json("/tags.json")
	if not data:
		return []
	matching = []
	for tag in data.get("tags", []) or []:
		name = tag.get("id") or tag.get("name")
		if not name:
			continue
		low = name.lower()
		if any(h in low for h in TAG_KEYWORD_HINTS):
			matching.append(name)
	return matching[:30]


def gather_categories():
	data = http_get_json("/categories.json")
	if not data:
		return []
	matching = []
	for cat in data.get("category_list", {}).get("categories", []) or []:
		name = (cat.get("name") or "").lower()
		if any(h in name for h in CATEGORY_KEYWORD_HINTS):
			matching.append({
				"id": cat.get("id"),
				"name": cat.get("name"),
				"slug": cat.get("slug"),
			})
	return matching[:15]


def fetch_topics_for_tag(tag: str):
	topics = []
	for page in range(1, MAX_PAGES_PER_SOURCE + 1):
		data = http_get_json(f"/tag/{quote(tag)}.json?page={page}")
		time.sleep(RATE_LIMIT_S)
		if not data or not data.get("topic_list", {}).get("topics"):
			break
		topics.extend(data["topic_list"]["topics"])
	return topics


def fetch_topics_for_category(cat: dict):
	topics = []
	cid = cat.get("id")
	slug = cat.get("slug")
	for page in range(0, MAX_PAGES_PER_SOURCE):
		data = http_get_json(f"/c/{quote(slug)}/{cid}.json?page={page}")
		time.sleep(RATE_LIMIT_S)
		if not data or not data.get("topic_list", {}).get("topics"):
			break
		topics.extend(data["topic_list"]["topics"])
	return topics


def fetch_topics_for_search(query: str):
	params = urlencode({"q": query})
	data = http_get_json(f"/search.json?{params}")
	time.sleep(RATE_LIMIT_S)
	if not data:
		return []
	# Collect topic objects where available
	topics = data.get("topics") or []
	return topics


def fetch_topic_detail(topic_id: int):
	data = http_get_json(f"/t/{topic_id}.json")
	time.sleep(RATE_LIMIT_S)
	return data


def build_post_url(slug: str, topic_id: int, post_number: int) -> str:
	return f"{BASE_URL}/t/{slug}/{topic_id}/{post_number}"


def process():
	os.makedirs(OUTPUT_DIR, exist_ok=True)

	# Discover
	print("Discovering tags and categories...", file=sys.stderr)
	rel_tags = gather_tags()
	rel_cats = gather_categories()
	print(f"Tags: {rel_tags}", file=sys.stderr)
	print(f"Categories: {[c.get('name') for c in rel_cats]}", file=sys.stderr)

	# Collect topics across sources
	topic_id_to_meta = {}

	# From tags
	for tag in rel_tags:
		for t in fetch_topics_For_tag_safe(tag):
			topic_id_to_meta[t.get("id")] = t

	# From categories
	for cat in rel_cats:
		for t in fetch_topics_For_category_safe(cat):
			topic_id_to_meta[t.get("id")] = t

	# From searches
	queries = list(set(FINANCE_KEYWORDS + [
		"treasury report", "monthly report", "quarterly report", "annual report",
		"budget proposal", "financial statement", "operations budget", "service provider budget",
		"multisig", "reserve", "grant budget", "compensation budget",
	]))
	for q in queries:
		for t in fetch_topics_For_search_safe(q):
			topic_id_to_meta[t.get("id")] = t

	print(f"Found candidate topics: {len(topic_id_to_meta)}", file=sys.stderr)

	# Fetch details
	results = []
	for idx, (tid, meta) in enumerate(topic_id_to_meta.items(), start=1):
		if idx % 10 == 0:
			print(f"Processing topic {idx}/{len(topic_id_to_meta)}", file=sys.stderr)
		detail = fetch_topic_detail(tid)
		if not detail:
			continue

		slug = detail.get("slug") or ""
		title = detail.get("title") or ""
		category_id = detail.get("category_id")
		tags = detail.get("tags") or []
		created_at = detail.get("created_at")
		category_name = None
		# Try to map category id to name from categories fetched earlier
		for c in rel_cats:
			if c.get("id") == category_id:
				category_name = c.get("name")
				break

		posts = (detail.get("post_stream", {}) or {}).get("posts", [])
		for p in posts:
			post_number = p.get("post_number")
			post_id = p.get("id")
			author = (p.get("username") or p.get("creator") or {}).get("username") if isinstance(p.get("creator"), dict) else p.get("username")
			cooked = p.get("cooked") or ""
			raw_text = strip_html(cooked)
			if not raw_text:
				continue

			# Skip non-finance posts by heuristic
			text_lower = (title + "\n" + raw_text).lower()
			if not any(k in text_lower for k in FINANCE_KEYWORDS):
				continue

			amounts = parse_amounts(raw_text)
			if not amounts:
				continue

			sentences = split_sentences(raw_text)
			# For each amount, attempt to find containing sentence
			for amt in amounts:
				amount_text = amt["amount_text"]
				snippet = None
				for s in sentences:
					if amount_text in s:
						snippet = s.strip()
						break
				if not snippet:
					# fallback to first 200 chars of raw text
					snippet = raw_text[:200]

				results.append({
					"source": "discuss.ens.domains",
					"topic_id": tid,
					"post_id": post_id,
					"topic_title": title,
					"post_url": build_post_url(slug, tid, post_number),
					"created_at": created_at,
					"author": author,
					"category": category_name,
					"tags": tags,
					"amount_value": amt["amount_value"],
					"currency": amt["currency"],
					"amount_text": amt["amount_text"],
					"sentence_snippet": snippet,
				})

	# Deduplicate by (post_id, amount_text)
	unique = {}
	for r in results:
		key = (r["post_id"], r["amount_text"], r["currency"])
		if key not in unique:
			unique[key] = r
	results = list(unique.values())

	# Write JSON and CSV
	json_path = os.path.join(OUTPUT_DIR, "ens_discuss_financial_data.json")
	csv_path = os.path.join(OUTPUT_DIR, "ens_discuss_financial_data.csv")

	with open(json_path, "w", encoding="utf-8") as f:
		json.dump(results, f, ensure_ascii=False, indent=2)

	fieldnames = [
		"source", "topic_id", "post_id", "topic_title", "post_url", "created_at",
		"author", "category", "tags", "amount_value", "currency", "amount_text", "sentence_snippet"
	]
	with open(csv_path, "w", encoding="utf-8", newline="") as f:
		writer = csv.DictWriter(f, fieldnames=fieldnames)
		writer.writeheader()
		for r in results:
			row = dict(r)
			# Serialize tags list
			row["tags"] = ",".join(r.get("tags") or [])
			writer.writerow(row)

	print(f"Wrote {len(results)} records\nJSON: {json_path}\nCSV: {csv_path}")


# Safe wrappers to continue on errors and not abort entire run

def fetch_topics_For_tag_safe(tag: str):
	try:
		return fetch_topics_for_tag(tag)
	except Exception as e:
		print(f"Error fetching topics for tag {tag}: {e}", file=sys.stderr)
		return []


def fetch_topics_For_category_safe(cat: dict):
	try:
		return fetch_topics_for_category(cat)
	except Exception as e:
		print(f"Error fetching topics for category {cat}: {e}", file=sys.stderr)
		return []


def fetch_topics_For_search_safe(q: str):
	try:
		return fetch_topics_for_search(q)
	except Exception as e:
		print(f"Error searching for {q}: {e}", file=sys.stderr)
		return []


if __name__ == "__main__":
	process()