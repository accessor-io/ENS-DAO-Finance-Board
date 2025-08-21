// Lightweight service for Discuss ENS (Discourse) public API
// Docs: https://docs.discourse.org/ (most endpoints are public JSON)

const DISCOURSE_BASE = import.meta.env && import.meta.env.DEV
  ? '/discuss'
  : 'https://discuss.ens.domains';

const cacheStore = new Map();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCache(key) {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > (entry.ttl || DEFAULT_TTL_MS)) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data, ttl = DEFAULT_TTL_MS) {
  cacheStore.set(key, { data, timestamp: Date.now(), ttl });
}

async function fetchJson(pathname, { cacheKey, ttl } = {}) {
  const key = cacheKey || pathname;
  const cached = getCache(key);
  if (cached) return cached;

  const url = `${DISCOURSE_BASE}${pathname}`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Discuss ENS API error ${response.status}: ${text || response.statusText}`);
  }
  const json = await response.json();
  setCache(key, json, ttl);
  return json;
}

export const discussENS = {
  async getSite() {
    // Basic site info: categories, settings, etc.
    return fetchJson('/site.json', { cacheKey: 'site', ttl: DEFAULT_TTL_MS });
  },

  async getCategories() {
    // Category list with nested subcategories
    return fetchJson('/categories.json', { cacheKey: 'categories', ttl: DEFAULT_TTL_MS });
  },

  async getLatest({ page = 0 } = {}) {
    // Latest topics; page is 0-based index for older pages
    const suffix = page > 0 ? `?page=${page}` : '';
    return fetchJson(`/latest.json${suffix}`, { cacheKey: `latest_${page}`, ttl: 60 * 1000 });
  },

  async getTop({ period = 'all' } = {}) {
    // period: 'all' | 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily'
    return fetchJson(`/top/${period}.json`, { cacheKey: `top_${period}`, ttl: 10 * 60 * 1000 });
  },

  async getTag(tag, { page = 1 } = {}) {
    // Topics under a tag
    return fetchJson(`/tag/${encodeURIComponent(tag)}.json?page=${page}`, { cacheKey: `tag_${tag}_${page}`, ttl: 5 * 60 * 1000 });
  },

  async getTopic(topicId) {
    return fetchJson(`/t/${encodeURIComponent(topicId)}.json`, { cacheKey: `topic_${topicId}`, ttl: 10 * 60 * 1000 });
  },

  async getCategoryTopics(categorySlug, { page = 0 } = {}) {
    const suffix = page > 0 ? `?page=${page}` : '';
    return fetchJson(`/c/${encodeURIComponent(categorySlug)}.json${suffix}`, { cacheKey: `cat_${categorySlug}_${page}`, ttl: 5 * 60 * 1000 });
  }
};

export default discussENS;

