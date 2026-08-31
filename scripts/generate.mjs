import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { coreCategories, coreIcons } from '@blcklab/moexi/collection';
import { renderSvg } from '@blcklab/moexi';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const corePackageJson = JSON.parse(await readFile(new URL('../node_modules/@blcklab/moexi/package.json', import.meta.url), 'utf8'));
const out = new URL('../dist/', import.meta.url);
const weights = ['thin', 'regular', 'bold'];
const sizes = [12, 14, 16, 18, 20, 24, 32, 40, 48];
const cdnRoot = `https://cdn.jsdelivr.net/npm/${packageJson.name}@${packageJson.version}/dist/`;

const ensure = async (path) => mkdir(new URL(path, out), { recursive: true });
await Promise.all([
  ensure('./'), ensure('./icons/'), ensure('./categories/'),
  ...weights.map((weight) => ensure(`./svg/${weight}/`)),
]);

const compactSvg = (svg) => svg
  .replace(/ width="24"/g, '')
  .replace(/ height="24"/g, '')
  .replace(/ aria-hidden="true"/g, '')
  .replace(/ focusable="false"/g, '')
  .replaceAll('currentColor', '#000')
  .replace(/>\s+</g, '><')
  .trim();

const baseCss = `/* @blcklab/moexi-css ${packageJson.version} | Moexi core ${corePackageJson.version} | MIT */
.mx {
  --mx-icon: var(--mx-icon-regular);
  display: inline-block;
  inline-size: 1em;
  block-size: 1em;
  flex: 0 0 auto;
  line-height: 1;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask-image: var(--mx-icon);
  mask-image: var(--mx-icon);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
  transform-origin: center;
}
.mx-thin { --mx-icon: var(--mx-icon-thin, var(--mx-icon-regular)); }
.mx-regular { --mx-icon: var(--mx-icon-regular); }
.mx-bold { --mx-icon: var(--mx-icon-bold, var(--mx-icon-regular)); }
${sizes.map((size) => `.mx-size-${size} { inline-size: ${size}px; block-size: ${size}px; }`).join('\n')}
`;

const iconRule = (icon, prefix = './') => {
  const aliases = icon.metadata?.aliases ?? [];
  const selectors = [`.mx-${icon.name}`, ...aliases.map((alias) => `.mx-${alias}`)].join(',\n');
  return `${selectors} {
  --mx-icon-thin: url("${prefix}svg/thin/${icon.name}.svg");
  --mx-icon-regular: url("${prefix}svg/regular/${icon.name}.svg");
  --mx-icon-bold: url("${prefix}svg/bold/${icon.name}.svg");
}\n`;
};

const regularRule = (icon, prefix = './') => {
  const aliases = icon.metadata?.aliases ?? [];
  const selectors = [`.mx-${icon.name}`, ...aliases.map((alias) => `.mx-${alias}`)].join(',\n');
  return `${selectors} { --mx-icon-regular: url("${prefix}svg/regular/${icon.name}.svg"); }\n`;
};

const playgroundRule = (icon) => {
  const aliases = icon.metadata?.aliases ?? [];
  const selectors = [`.mx-${icon.name}`, ...aliases.map((alias) => `.mx-${alias}`)].join(',\n');
  return `${selectors} {
  --mx-icon-thin: url("${cdnRoot}svg/thin/${icon.name}.svg");
  --mx-icon-regular: url("${cdnRoot}svg/regular/${icon.name}.svg");
  --mx-icon-bold: url("${cdnRoot}svg/bold/${icon.name}.svg");
}\n`;
};

for (const icon of coreIcons) {
  for (const weight of weights) {
    const svg = compactSvg(renderSvg(icon, { variant: weight, size: 24 }));
    await writeFile(new URL(`./svg/${weight}/${icon.name}.svg`, out), `${svg}\n`, 'utf8');
  }
  await writeFile(
    new URL(`./icons/${icon.name}.css`, out),
    `${baseCss}\n${iconRule(icon, '../')}`,
    'utf8',
  );
}

await writeFile(new URL('./base.css', out), baseCss, 'utf8');
await writeFile(
  new URL('./moexi.css', out),
  `${baseCss}\n${coreIcons.map((icon) => iconRule(icon)).join('\n')}`,
  'utf8',
);
await writeFile(
  new URL('./regular.css', out),
  `${baseCss}\n${coreIcons.map((icon) => regularRule(icon)).join('\n')}`,
  'utf8',
);

await writeFile(
  new URL('./playground.css', out),
  `${baseCss}\n${coreIcons.map((icon) => playgroundRule(icon)).join('\n')}`,
  'utf8',
);

for (const [category, icons] of Object.entries(coreCategories)) {
  await writeFile(
    new URL(`./categories/${category}.css`, out),
    `${baseCss}\n${icons.map((icon) => iconRule(icon, '../')).join('\n')}`,
    'utf8',
  );
}

const aliases = Object.fromEntries(coreIcons.flatMap((icon) =>
  (icon.metadata?.aliases ?? []).map((alias) => [alias, icon.name])));
const catalog = {
  name: packageJson.name,
  version: packageJson.version,
  coreVersion: corePackageJson.version,
  iconCount: coreIcons.length,
  classPrefix: 'mx',
  weights,
  sizes,
  aliases,
  categories: Object.fromEntries(Object.entries(coreCategories).map(([name, icons]) => [name, icons.length])),
  icons: coreIcons.map((icon) => ({
    name: icon.name,
    className: `mx mx-${icon.name}`,
    category: icon.metadata?.category ?? null,
    aliases: icon.metadata?.aliases ?? [],
  })),
  colorModel: 'currentColor-mask',
  multicolor: false,
};
await writeFile(new URL('./catalog.json', out), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
console.log(`Generated ${coreIcons.length} Moexi CSS icons in ${weights.length} weights.`);
