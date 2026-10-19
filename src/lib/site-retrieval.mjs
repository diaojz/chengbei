// Topic fallback for natural-language questions when exact full-text search is empty.
export function rankArticles(question, articles) {
 const query=String(question).toLowerCase().slice(0,500);
 const topics=query.match(/codex|claude|dify|npm|npx|node\.?js|agent|mcp|重连|权限|登录|部署|知识库|买房|租房|直播|终端|状态码|求职|面试|语音/g)||[];
 const english=query.match(/[a-z][a-z0-9-]{2,}/g)||[];
 const chinese=[...query.matchAll(/[\u3400-\u9fff]{2,}/g)].flatMap(([s])=>Array.from({length:s.length-1},(_,i)=>s.slice(i,i+2)));
 const terms=[...new Set([...topics,...english,...chinese])];
 return articles.map(article=>{const title=article.title.toLowerCase();const text=(article.title+' '+article.description+' '+article.topics.join(' ')).toLowerCase();return {article,score:terms.reduce((n,t)=>n+(title.includes(t)?3:text.includes(t)?1:0),0)};}).filter(r=>r.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(r=>r.article);
}
