# @blcklab/moexi-css

Use Moexi icons with simple CSS classes:

```html
<i class="mx mx-search" aria-hidden="true"></i>
<i class="mx mx-heart mx-bold" aria-hidden="true"></i>
```

The package contains all 256 Moexi core icons as SVG masks. There is no icon font and no runtime JavaScript.

## Install

```bash
npm install @blcklab/moexi-css
```

Load everything:

```css
@import '@blcklab/moexi-css';
```

Then use any icon:

```html
<i class="mx mx-home" aria-hidden="true"></i>
<i class="mx mx-terminal" aria-hidden="true"></i>
<i class="mx mx-flame" aria-hidden="true"></i>
```

`<span>` works too.

## Color

Icons inherit `currentColor`.

```css
.favorite { color: oklch(70% 0.2 20); }
```

```html
<i class="mx mx-heart favorite" aria-hidden="true"></i>
```

## Weight

Regular is the default.

```html
<i class="mx mx-search mx-thin"></i>
<i class="mx mx-search mx-regular"></i>
<i class="mx mx-search mx-bold"></i>
```

## Size

Icons are `1em`, so `font-size` is usually enough.

```css
.icon-lg { font-size: 24px; }
```

Optical helpers are also included:

```html
<i class="mx mx-search mx-size-16"></i>
<i class="mx mx-search mx-size-20"></i>
<i class="mx mx-search mx-size-24"></i>
```

The `mx-size-*` name avoids collisions with Tailwind's `mx-*` margin utilities.

## Smaller imports

Regular weight only:

```css
@import '@blcklab/moexi-css/regular.css';
```

One category:

```css
@import '@blcklab/moexi-css/categories/development.css';
```

One icon:

```css
@import '@blcklab/moexi-css/icons/search.css';
```

## Accessibility

Hide decorative icons from assistive technology:

```html
<button>
  <i class="mx mx-search" aria-hidden="true"></i>
  Search
</button>
```

Give standalone meaningful icons a label:

```html
<i class="mx mx-warning" role="img" aria-label="Warning"></i>
```

## Multicolor icons

CSS masks are intentionally monochrome. Use `@blcklab/moexi` or a framework adapter when you need Moexi color variants, layers, or custom icon definitions.

## License

MIT
