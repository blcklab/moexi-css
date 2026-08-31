# Accessibility

## Decorative icon

If visible text already explains the action, hide the icon from assistive technology.

```html
<button>
  <i class="mx mx-search" aria-hidden="true"></i>
  Search
</button>
```

## Meaningful standalone icon

If the icon itself carries meaning, give it an accessible name.

```html
<i class="mx mx-warning" role="img" aria-label="Warning"></i>
```

Do not rely on icon shape alone when text would make the action clearer.
