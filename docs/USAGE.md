# Usage

## Icon class

```html
<i class="mx mx-home" aria-hidden="true"></i>
```

`mx` is the base class. `mx-home` selects the icon.

## Weight

```html
<i class="mx mx-search mx-thin"></i>
<i class="mx mx-search mx-regular"></i>
<i class="mx mx-search mx-bold"></i>
```

Regular is the default.

## Size

Icons are `1em`, so `font-size` works normally.

```css
.icon-lg { font-size: 24px; }
```

Or use the helpers:

```html
<i class="mx mx-search mx-size-20"></i>
<i class="mx mx-search mx-size-32"></i>
```

## Color

Icons use `currentColor`.

```css
.favorite { color: #e11d48; }
```

```html
<i class="mx mx-heart favorite" aria-hidden="true"></i>
```

## Aliases

Official aliases include `mx-console`, `mx-shell`, `mx-favorite`, and `mx-shine`.
