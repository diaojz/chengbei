/** Keep article discovery predictable across shared URLs and browser history. */
export function readArticleFilters(url, topics) {
  const value = new URL(url, 'https://chengbei.org');
  const topic = value.searchParams.get('topic') || '';
  return { topic: topics.includes(topic) ? topic : '', query: value.searchParams.get('q') || '' };
}

export function articleMatches({ text, topics }, { topic, query }) {
  const normalize = (value) => String(value || '').normalize('NFKC').toLocaleLowerCase();
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return (!topic || topics.includes(topic)) && words.every((word) => normalize(text).includes(word));
}

export function articleFilterURL(url, { topic, query }) {
  const value = new URL(url, 'https://chengbei.org');
  if (topic) value.searchParams.set('topic', topic); else value.searchParams.delete('topic');
  if (query.trim()) value.searchParams.set('q', query.trim()); else value.searchParams.delete('q');
  return `${value.pathname}${value.search}${value.hash}`;
}
