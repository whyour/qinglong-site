import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve, extname } from 'node:path';

const root = resolve(process.argv[2] || '.');
const errors = [];
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}
const locales = ['zh', 'en'];
const pages = locales.map((lang) => new Set(
  files(join(root, 'docs', lang))
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => relative(join(root, 'docs', lang), file).replace(/\.mdx?$/, '')),
));
for (const [index, lang] of locales.entries()) {
  for (const page of pages[index]) {
    if (!pages[1 - index].has(page)) errors.push(`Missing translation: ${locales[1 - index]}/${page}`);
  }
  for (const file of files(join(root, 'docs', lang))) {
    if (file.endsWith('_meta.json')) {
      const entries = JSON.parse(readFileSync(file, 'utf8'));
      for (const entry of entries) {
        const name = typeof entry === 'string' ? entry : entry.name;
        if (!name) continue; // Top-level navigation uses links instead of names.
        const path = resolve(file, '..', name);
        if (![path, `${path}.md`, `${path}.mdx`].some(existsSync)) {
          errors.push(`${relative(root, file)}: missing navigation target ${name}`);
        }
      }
    }
    if (/\.mdx?$/.test(file)) {
      const text = readFileSync(file, 'utf8');
      let fence;
      for (const [index, line] of text.split(/\r?\n/).entries()) {
        const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (!match) continue;
        if (!fence) {
          fence = { marker: match[1][0], length: match[1].length, line: index + 1 };
        } else if (match[1][0] === fence.marker && match[1].length >= fence.length) {
          if (match[2].trim()) {
            errors.push(`${relative(root, file)}:${index + 1}: code fence must close before another language block`);
          } else {
            fence = undefined;
          }
        }
      }
      if (fence) errors.push(`${relative(root, file)}:${fence.line}: unclosed code fence`);
      for (const block of text.matchAll(/```(?:bash|sh|shell)\n([\s\S]*?)```/g)) {
        if (/\\\r?\n\s*#/.test(block[1])) {
          errors.push(`${relative(root, file)}: comment interrupts shell continuation`);
        }
      }
    }
  }
}
const build = join(root, 'doc_build');
if (!existsSync(build)) throw new Error('Run npm run build before checking rendered links.');
const isFile = (path) => existsSync(path) && statSync(path).isFile();
// Guard against global metadata silently overriding localized theme metadata.
for (const [page, lang, title, description] of [
  ['api/user.html', 'zh', '青龙文档', '青龙定时任务管理平台'],
  ['en/api/user.html', 'en', 'Qinglong Docs', 'Deployment, scripts, CLI'],
]) {
  const html = readFileSync(join(build, page), 'utf8');
  const renderedTitle = html.match(/<title\b[^>]*>([^<]*)<\/title>/)?.[1] || '';
  if (!html.includes(`lang="${lang}"`) || !renderedTitle.endsWith(title)) {
    errors.push(`${page}: incorrect localized language/title`);
  }
  if (!html.includes(`name="description" content="${description}`)) {
    errors.push(`${page}: missing localized description`);
  }
}

const htmlPages = new Map(files(build)
  .filter((file) => file.endsWith('.html'))
  .map((file) => [file, readFileSync(file, 'utf8')]));
const pageIds = new Map([...htmlPages].map(([file, html]) => [
  file, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])),
]));
for (const [file, html] of htmlPages) {
  // The shared fallback has a language switch to /en/404 without a locale file.
  if (relative(build, file) === '404.html') continue;
  const pageUrl = new URL(relative(build, file), 'https://docs.test/');
  for (const [, attribute, href] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
    let url;
    let pathname;
    let fragment;
    try {
      url = new URL(href.replaceAll('&amp;', '&'), pageUrl);
      pathname = decodeURIComponent(url.pathname);
      fragment = decodeURIComponent(url.hash.slice(1));
    } catch {
      errors.push(`${relative(build, file)}: invalid link ${href}`);
      continue;
    }
    const target = resolve(build, `.${pathname}`);
    const candidates = [target, join(target, 'index.html')];
    if (!extname(target)) candidates.push(`${target}.html`);
    const found = candidates.find(isFile);
    if (!found) {
      errors.push(`${relative(build, file)}: broken link ${href}`);
    } else if (attribute === 'href' && fragment && pageIds.has(found)
      && !fragment.startsWith(':~:text=') && !pageIds.get(found).has(fragment)) {
      errors.push(`${relative(build, file)}: missing anchor ${href}`);
    }
  }
}
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages[0].size} bilingual pages, navigation, code fences, shell continuations and rendered internal links/anchors/assets.`);
}
