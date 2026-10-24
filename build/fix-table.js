// 用真实元数据重写 README 里的「其他公开仓库」表格
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const stats = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.gh-langs.json'), 'utf8'));

const featured = ['dao3-ui-spec', 'box3-lite-engine', 'box3-map-converter', 'natsume-stack'];
const others = stats.pubs.filter((p) => !featured.includes(p.name) && p.name !== 'natsume-stack');

const rows = others
  .sort((a, b) => (b.pushed || '').localeCompare(a.pushed || ''))
  .map((p) => `| [${p.name}](https://github.com/natsume-stack/${p.name}) | ${p.lang || '—'} | ${p.stars} | ${(p.pushed || '').slice(0, 10)} |`);

const table = `<details>
<summary>其他公开仓库</summary>

| 仓库 | 主要语言 | ★ | 最近推送 |
|---|---|---|---|
${rows.join('\n')}

</details>`;

let md = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const start = md.indexOf('<details>\n<summary>其他公开仓库</summary>');
const end = md.indexOf('</details>', start) + '</details>'.length;
if (start < 0) { console.error('找不到锚点'); process.exit(1); }
md = md.slice(0, start) + table + md.slice(end);
fs.writeFileSync(path.join(ROOT, 'README.md'), md);
console.log(`已用真实数据重写表格：${others.length} 个仓库（这些仓库的 description 在 API 里都是空的，所以只列语言/星数/时间）`);
console.log(rows.join('\n'));
