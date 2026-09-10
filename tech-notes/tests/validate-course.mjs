import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dataPath = path.join(root, 'data', 'season-1.json');
const assert = (value, message) => { if (!value) throw new Error(message); };

assert(fs.existsSync(dataPath), '缺少 tech-notes/data/season-1.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

assert(data.season === 1, 'season 必须为 1');
assert(data.title && data.promise, '缺少课程标题或学习承诺');
assert(Array.isArray(data.phases) && data.phases.length === 3, '第一季必须包含 3 个阶段');
assert(Array.isArray(data.weeks) && data.weeks.length === 12, '第一季必须包含 12 周');
assert(data.weeks.every((week, index) => week.number === index + 1), '周次必须从 1 到 12 连续排列');
assert(data.weeks.every((week) => week.title && week.outcome && week.project), '每周必须说明主题、成果与项目');
assert(Array.isArray(data.currentWeek?.days) && data.currentWeek.days.length === 7, '当前周必须包含 7 天');
assert(Array.isArray(data.lessons) && data.lessons.length > 0, '至少需要一节已发布课程');

for (const lesson of data.lessons) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(lesson.date), `课程日期不合法：${lesson.date}`);
  assert(lesson.title && lesson.summary && lesson.outcome, `课程 ${lesson.date} 缺少核心文案`);
  assert(Array.isArray(lesson.tags) && lesson.tags.length >= 2, `课程 ${lesson.date} 至少需要两个标签`);
  assert(Array.isArray(lesson.sources) && lesson.sources.length >= 2, `课程 ${lesson.date} 至少需要两个来源`);
  assert(lesson.sources.every((source) => /^https:\/\//.test(source.url)), `课程 ${lesson.date} 存在非 HTTPS 来源`);
  assert(fs.existsSync(path.join(root, lesson.href)), `课程详情页不存在：${lesson.href}`);
}

console.log(`课程数据校验通过：${data.phases.length} 个阶段、${data.weeks.length} 周、${data.lessons.length} 节已发布课程`);
