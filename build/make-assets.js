// 生成 profile 仓库的 SVG 资源（明暗双版本）
// 用法：node build/make-assets.js   —— 读 build/data.json，输出 assets/*.svg
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'data.json'), 'utf8'));

const T = {
  light: { bg: '#F0EEE6', panel: '#FAF9F5', ink: '#141413', muted: '#6E6A60', hair: '#DEDACB', accent: '#D97757', accent2: '#7D7665' },
  dark: { bg: '#0F1113', panel: '#171A1D', ink: '#F2F0EA', muted: '#9A968B', hair: '#262A2E', accent: '#E08D6E', accent2: '#8FA6B2' },
};
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
const SANS = "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// 粗略文本宽度：CJK 按 1em，西文按 0.55em（mono 0.6em）
const tw = (s, px, mono) => [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 0x2e7f ? 1 : (mono ? 0.6 : 0.55)), 0) * px;

function frame(w, h, theme, inner, label) {
  const t = T[theme];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<defs>
<linearGradient id="wash${theme}" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="${t.accent}" stop-opacity="${theme === 'light' ? 0.15 : 0.2}"/>
  <stop offset="58%" stop-color="${t.accent}" stop-opacity="0"/>
</linearGradient>
<pattern id="dots${theme}" width="24" height="24" patternUnits="userSpaceOnUse">
  <circle cx="1.1" cy="1.1" r="1.1" fill="${t.hair}"/>
</pattern>
<clipPath id="clip${theme}"><rect width="${w}" height="${h}" rx="14"/></clipPath>
</defs>
<g clip-path="url(#clip${theme})">
<rect width="${w}" height="${h}" fill="${t.bg}"/>
<rect width="${w}" height="${h}" fill="url(#dots${theme})" opacity="0.5"/>
<rect width="${w}" height="${h}" fill="url(#wash${theme})"/>
${inner}
</g>
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="13.5" fill="none" stroke="${t.hair}"/>
</svg>`;
}

function banner(theme) {
  const t = T[theme]; const b = data.banner;
  let tx = 44;
  const tags = b.tags.map((tag) => {
    const w = tw(tag, 11.5, true) + 24;
    const g = `<g><rect x="${tx.toFixed(1)}" y="214" width="${w.toFixed(1)}" height="27" rx="13.5" fill="none" stroke="${t.hair}"/><text x="${(tx + 12).toFixed(1)}" y="232" font-family="${MONO}" font-size="11.5" fill="${t.accent2}">${esc(tag)}</text></g>`;
    tx += w + 10;
    return g;
  }).join('\n');
  const inner = `
<text x="44" y="64" font-family="${MONO}" font-size="12" letter-spacing="3.4" fill="${t.muted}">${esc(b.kicker.toUpperCase())}</text>
<line x1="44" y1="84" x2="126" y2="84" stroke="${t.accent}" stroke-width="2"/>
<text x="42" y="150" font-family="${SERIF}" font-size="60" letter-spacing="-1.8" fill="${t.ink}">${esc(b.title)}</text>
<text x="44" y="188" font-family="${SANS}" font-size="16" fill="${t.muted}">${esc(b.subtitle)}</text>
${tags}
<g transform="translate(664,46)">
  <rect x="0" y="0" width="172" height="172" rx="12" fill="none" stroke="${t.hair}"/>
  <rect x="24" y="24" width="124" height="124" rx="8" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.8"/>
  <rect x="50" y="50" width="72" height="72" rx="6" fill="${t.accent}" opacity="0.15"/>
  <text x="86" y="97" text-anchor="middle" font-family="${SERIF}" font-size="32" fill="${t.ink}">${esc(b.mono)}</text>
</g>`;
  return frame(860, 272, theme, inner, 'Natsume');
}

const GLYPH = {
  engine: (t) => `<g stroke="${t.accent}" fill="none" stroke-width="1.6">
    <rect x="14" y="14" width="60" height="60" rx="9"/>
    <rect x="29" y="29" width="30" height="30" rx="5" fill="${t.accent}" fill-opacity="0.18" stroke="none"/>
    <path d="M44 0v10M44 78v10M0 44h10M78 44h10" stroke-linecap="round" opacity="0.65"/></g>`,
  converter: (t) => `<g stroke="${t.accent}" fill="none" stroke-width="1.6">
    <rect x="6" y="16" width="32" height="56" rx="7"/>
    <rect x="50" y="16" width="32" height="56" rx="7" fill="${t.accent}" fill-opacity="0.18" stroke="${t.accent}"/>
    <path d="M42 44h6M45 39l4 5-4 5" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  spec: (t) => `<g>
    <rect x="10" y="12" width="20" height="20" rx="5" fill="${t.accent}"/>
    <rect x="36" y="12" width="20" height="20" rx="5" fill="${t.accent}" opacity="0.55"/>
    <rect x="62" y="12" width="20" height="20" rx="5" fill="${t.accent}" opacity="0.22"/>
    <rect x="10" y="44" width="72" height="4" rx="2" fill="${t.ink}" opacity="0.3"/>
    <rect x="10" y="56" width="52" height="4" rx="2" fill="${t.ink}" opacity="0.18"/>
    <rect x="10" y="68" width="64" height="4" rx="2" fill="${t.ink}" opacity="0.1"/></g>`,
};

function card(p, theme) {
  const t = T[theme];
  const nameW = tw(p.name, 19, true);
  const badge = p.badge
    ? `<g><rect x="${(60 + nameW + 16).toFixed(1)}" y="25" width="${(tw(p.badge, 11, true) + 20).toFixed(1)}" height="22" rx="11" fill="none" stroke="${t.hair}"/><text x="${(60 + nameW + 26).toFixed(1)}" y="40" font-family="${MONO}" font-size="11" fill="${t.muted}">${esc(p.badge)}</text></g>`
    : '';
  let mx = 60;
  const meta = [`<circle cx="${mx + 5}" cy="${128 - 4}" r="5" fill="${p.langColor}"/>`]
    .concat([p.lang].concat(p.meta).map((m, i) => {
      const x = mx + 16 + [p.lang].concat(p.meta).slice(0, i).reduce((a, s) => a + tw(s, 11.5, true) + 26, 0);
      const node = i ? `<text x="${(x - 16).toFixed(1)}" y="128" font-family="${MONO}" font-size="11.5" fill="${t.muted}" opacity="0.5">/</text>` : '';
      return node + `<text x="${x.toFixed(1)}" y="128" font-family="${MONO}" font-size="11.5" fill="${t.accent2}">${esc(m)}</text>`;
    })).join('\n  ');
  const inner = `
<rect x="0" y="0" width="4" height="196" fill="${t.accent}"/>
<text x="26" y="42" font-family="${SERIF}" font-size="15" fill="${t.muted}">${esc(p.index)}</text>
<text x="60" y="44" font-family="${MONO}" font-size="19" font-weight="600" letter-spacing="-0.4" fill="${t.ink}">${esc(p.name)}</text>
${badge}
<text x="60" y="76" font-family="${SANS}" font-size="15" fill="${t.ink}">${esc(p.title)}</text>
<text x="60" y="101" font-family="${SANS}" font-size="13" fill="${t.muted}">${esc(p.desc)}</text>
<g>${meta}</g>
<line x1="60" y1="150" x2="820" y2="150" stroke="${t.hair}"/>
<text x="60" y="174" font-family="${MONO}" font-size="11" fill="${t.muted}">${esc(p.footer)}</text>
<g transform="translate(712,52)">${GLYPH[p.glyph](t)}</g>`;
  return frame(860, 196, theme, inner, p.name);
}

function langbar(theme) {
  const t = T[theme];
  const items = data.languages;
  const W = 776;
  let x = 42;
  const bars = items.map((it) => {
    const w = (it.pct / 100) * W;
    const node = `<rect x="${x.toFixed(1)}" y="50" width="${Math.max(w - 2.5, 2).toFixed(1)}" height="15" rx="3" fill="${it.color}"/>`;
    x += w;
    return node;
  }).join('\n');
  const legend = items.map((it, i) => {
    const lx = 42 + (i % 4) * 196, ly = 94 + Math.floor(i / 4) * 26;
    return `<circle cx="${lx + 5}" cy="${ly - 4}" r="4.5" fill="${it.color}"/><text x="${lx + 16}" y="${ly}" font-family="${MONO}" font-size="12" fill="${t.ink}">${esc(it.name)}</text><text x="${(lx + 16 + tw(it.name, 12, true) + 8).toFixed(1)}" y="${ly}" font-family="${MONO}" font-size="12" fill="${t.muted}">${it.pct.toFixed(1)}%</text>`;
  }).join('\n');
  const inner = `
<text x="42" y="32" font-family="${MONO}" font-size="11.5" letter-spacing="2.8" fill="${t.muted}">${esc(data.languagesTitle.toUpperCase())}</text>
${bars}
${legend}
<text x="42" y="158" font-family="${SANS}" font-size="12" fill="${t.muted}" opacity="0.75">${esc(data.languagesNote)}</text>`;
  return frame(860, 180, theme, inner, 'language distribution');
}

const out = path.join(ROOT, 'assets');
fs.mkdirSync(out, { recursive: true });
const files = [['banner', banner], ['langbar', langbar]];
for (const p of data.projects) files.push([`card-${p.slug}`, (th) => card(p, th)]);
for (const [name, fn] of files) {
  fs.writeFileSync(path.join(out, `${name}.svg`), fn('light'));
  fs.writeFileSync(path.join(out, `${name}.dark.svg`), fn('dark'));
}
console.log('assets written:', fs.readdirSync(out).sort().join('  '));
