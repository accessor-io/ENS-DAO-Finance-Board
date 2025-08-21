import React, { useEffect, useMemo, useState } from 'react';
import { discussENS } from '../services/discussENS';

const Section = ({ title, children, action }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const TopicRow = ({ topic, usersById }) => {
  const posters = topic.posters || [];
  const firstPoster = posters[0];
  const author = firstPoster && usersById[firstPoster.user_id];
  const likeCount = topic.like_count ?? topic.like_count ?? 0;

  return (
    <a
      href={`https://discuss.ens.domains/t/${topic.slug}/${topic.id}`}
      target="_blank"
      rel="noreferrer"
      className="block px-3 py-2 rounded hover:bg-gray-700/60 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-white font-medium truncate">{topic.title}</div>
          <div className="text-xs text-gray-400 mt-0.5 truncate">
            #{topic.category_id} • {author?.username || 'unknown'} • {topic.posts_count} posts
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-300 flex-shrink-0">
          <span className="px-2 py-0.5 rounded bg-gray-700">{likeCount} ♥</span>
          <span className="px-2 py-0.5 rounded bg-gray-700">{topic.views} views</span>
        </div>
      </div>
    </a>
  );
};

const ENSDiscuss = () => {
  const [categories, setCategories] = useState(null);
  const [latest, setLatest] = useState(null);
  const [topPeriod, setTopPeriod] = useState('monthly');
  const [top, setTop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const [cat, lat, t] = await Promise.all([
          discussENS.getCategories(),
          discussENS.getLatest(),
          discussENS.getTop({ period: topPeriod })
        ]);
        if (cancelled) return;
        setCategories(cat);
        setLatest(lat);
        setTop(t);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load Discuss ENS');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [topPeriod]);

  const usersByIdLatest = useMemo(() => {
    const map = {};
    if (latest?.users) {
      for (const u of latest.users) map[u.id] = u;
    }
    return map;
  }, [latest]);

  const usersByIdTop = useMemo(() => {
    const map = {};
    if (top?.users) {
      for (const u of top.users) map[u.id] = u;
    }
    return map;
  }, [top]);

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-white">Loading Discuss ENS…</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/40 border border-red-700 text-red-100 p-4 rounded">{error}</div>
    );
  }

  const categoryList = categories?.category_list?.categories || [];
  const latestTopics = latest?.topic_list?.topics || [];
  const topTopics = top?.topic_list?.topics || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-1 space-y-3">
        <Section title="Categories">
          <div className="divide-y divide-gray-700/60">
            {categoryList.slice(0, 20).map((cat) => (
              <a
                key={cat.id}
                href={`https://discuss.ens.domains/c/${cat.slug}`}
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2 hover:bg-gray-700/60 rounded transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium">{cat.name}</div>
                  <div className="text-xs text-gray-300">{cat.topic_count} topics</div>
                </div>
                {cat.description && (
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{cat.description}</div>
                )}
              </a>
            ))}
          </div>
        </Section>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <Section
          title="Latest Topics"
          action={
            <a
              href="https://discuss.ens.domains/latest"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300"
            >View all</a>
          }
        >
          <div className="divide-y divide-gray-700/60">
            {latestTopics.slice(0, 15).map((t) => (
              <TopicRow key={t.id} topic={t} usersById={usersByIdLatest} />)
            )}
          </div>
        </Section>

        <Section
          title="Top Topics"
          action={
            <div className="flex items-center gap-2">
              <select
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
                value={topPeriod}
                onChange={(e) => setTopPeriod(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="all">All</option>
              </select>
              <a
                href={`https://discuss.ens.domains/top/${topPeriod}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300"
              >View all</a>
            </div>
          }
        >
          <div className="divide-y divide-gray-700/60">
            {topTopics.slice(0, 15).map((t) => (
              <TopicRow key={t.id} topic={t} usersById={usersByIdTop} />)
            )}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default ENSDiscuss;

