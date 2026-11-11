---
trigger: glob
globs: '**/*.{svelte,scss,css}'
description: 'Styling conventions: scoped SCSS, design tokens, theming, responsive mixins, RTL-safe layout.'
applyTo: '**/*.{svelte,scss,css}'
---

# Styling

- SCSS in scoped Svelte `<style lang="scss">` blocks; component-scoped styles
  preferred.
- All values via CSS custom properties (`--ni-*`, `--color-*`, `--gap-*`,
  `--border-radius-*`).
- Responsive mixins: `for-mobile`, `for-tablet-sm`, `for-desktop`, `for-mouse`,
  `for-touch`. Import as `@use "$style/scss/mixins/index" as *;`
- Full light/dark theme support. Never use raw hex values - use semantic CSS
  variables.
- Kebab-case class names; variants go on `data-variant` / `data-style` /
  `data-color`, not concatenated classes (details in `components.md`).
- **RTL-safe by default.** The app ships in RTL locales (e.g. `fa-IR`), so never
  hardcode a physical side for layout. Use logical properties:
  `padding-inline-*`/`margin-inline-*`, `inset-inline-start`/`inset-inline-end`
  (not `left`/`right`), `text-align: start/end`, `border-inline-*`, and logical
  corner radii (`border-start-start-radius`, etc.). Full direction and
  accessibility rules: `components.md`.
