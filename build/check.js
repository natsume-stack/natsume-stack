// 把生成的 SVG 拼成一张检查图，便于渲染后目视核对
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'data.json'), 'utf8'));
const names = ['banner', ...data.projects.map((p) => 'card-' + p.slug), 'langbar'];
const read = (f) => fs.readFileSync(path.join(ROOT, 'assets', f), 'utf8');

const light = names.map((n) => read(n + '.svg')).join('\n');
const dark = names.map((n) => read(n + '.dark.svg')).join('\n');

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:#fff;font-family:sans-serif;display:flex;gap:24px;align-items:flex-start}
.col{display:flex;flex-direction:column;gap:14px}
.dark-wrap{background:#0d1117;padding:14px;border-radius:8px}
</style></head><body>
<div class="col">${light}</div>
<div class="col dark-wrap">${dark}</div>
</body></html>`;
fs.writeFileSync(path.join(ROOT, 'build', 'check.html'), html);
console.log('wrote build/check.html');
