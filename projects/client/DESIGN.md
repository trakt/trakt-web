---
name: "Trakt Web Design System"
colors:
  purple:
    "50": "#f5ecf9"
    "100": "#e1c4ed"
    "200": "#d3a8e5"
    "300": "#bf80d9"
    "400": "#b268d1"
    "500": "#9f42c6"
    "600": "#913cb4"
    "700": "#712f8d"
    "800": "#57246d"
    "900": "#431c53"
  red:
    "50": "#ffe6e6"
    "100": "#ffb0b0"
    "500": "#ff0000"
    "600": "#e80000"
    "700": "#b50000"
    "800": "#8c0000"
    "900": "#6b0000"
  blue:
    "500": "#3399ff"
    "700": "#0066cc"
    "800": "#004c99"
  orange:
    "100": "#ffe5cc"
    "500": "#ff9933"
    "600": "#ff8000"
    "800": "#cc6600"
  shade:
    "10": "#fefefe"
    "20": "#fbfbfb"
    "50": "#f1f2f3"
    "100": "#d2d6d9"
    "200": "#bcc2c6"
    "300": "#9ea6ac"
    "400": "#8b959c"
    "500": "#6e7a83"
    "600": "#646f77"
    "700": "#4e575d"
    "800": "#3d4348"
    "900": "#2e3337"
    "920": "#212427"
    "930": "#191c1e"
    "940": "#131517"
    "1000": "#0b0d0f"
  theme:
    light:
      background: "{colors.shade.10}"
      foreground: "{colors.shade.920}"
      text-primary: "{colors.shade.900}"
      text-secondary: "{colors.shade.800}"
      text-emphasis: "{colors.purple.700}"
      card-background: "{colors.shade.10}"
      border: "{colors.shade.200}"
    dark:
      background: "color-mix(in srgb, {colors.shade.920} 97%, {colors.purple.900})"
      foreground: "{colors.shade.10}"
      text-primary: "{colors.shade.10}"
      text-secondary: "{colors.shade.300}"
      text-emphasis: "{colors.purple.300}"
      card-background: "{colors.shade.930}"
      border: "{colors.shade.700}"
typography:
  tag:
    fontSize: "0.625rem"
    fontWeight: "400"
  text:
    fontSize: "0.875rem"
    fontWeight: "400"
  separator:
    fontSize: "1rem"
    fontWeight: "600"
  title:
    fontSize: "1.125rem"
    fontWeight: "600"
spacing:
  micro: "0.125rem"
  xxs: "0.25rem"
  xs: "0.5rem"
  s: "0.75rem"
  m: "1rem"
  l: "1.5rem"
  xl: "2rem"
  xxl: "2.75rem"
rounded:
  xs: "0.25rem"
  s: "0.5rem"
  m: "0.75rem"
  l: "1rem"
  xl: "1.25rem"
  xxl: "1.5rem"
elevation:
  layer-background: "-1"
  layer-base: "1"
  layer-raised: "2"
  layer-floating: "3"
  layer-dialog: "666"
  layer-overlay: "777"
  layer-menu: "778"
  layer-top: "999"
shadows:
  base: "0.0625rem 0.0625rem 0.25rem 0.125rem color-mix(in srgb, var(--color-shadow) 10%, transparent)"
  floating: "-0.125rem 0.0625rem 0.625rem 0 color-mix(in srgb, var(--color-shadow) 25%, transparent)"
  raised: "0 0.5rem 1.5rem 0 color-mix(in srgb, var(--color-shadow) 40%, transparent)"
  menu: "0 0.25rem 1.25rem 0 color-mix(in srgb, var(--color-shadow) 40%, transparent)"
  dialog: "0 0 1.5rem 0.75rem color-mix(in srgb, var(--color-shadow) 50%, transparent)"
  navbar: "0 0.5rem 1rem 0.25rem color-mix(in srgb, var(--color-shadow) 30%, transparent)"
motion:
  transition-increment: "150ms"
  transition-duration-short: "300ms"
  duration-jiggle: "450ms"
---

# Trakt Web Design System

## Brand & Style
The Trakt Web visual identity is highly cinematic, dynamic, and content-forward. It is designed to act as a sleek gallery for media artwork, letting posters and backdrops shine while maintaining an intuitive, structural interface. The core brand accent is **Purple**, which is used throughout to direct user focus, indicate primary actions, and highlight ratings.

## Colors & Themes
The color system operates on an exhaustive "shade" scale (ranging from pure white `shade-10` to deep dark `shade-1000`). This extensive neutral palette gives the interface its layered, high-fidelity look.

- **Primary Accent (`Purple`)**: Signifies interaction, active states, progress, and the core Trakt rating sentiment.
- **Secondary Accents**: Red is reserved for VIP/upgrade surfaces, discounts, and errors. Orange, Blue, and Green distinguish specific UI components like tags or statuses (e.g., trend tags, preview tags).
- **Light & Dark Mode**: The app seamlessly toggles themes. Dark mode does not simply invert to flat black; instead, its background (`color-mix(in srgb, var(--shade-920) 97%, var(--purple-900))`) subtly infuses purple into deep greys to maintain a cool, cinematic darkness.

## Typography
Typography is highly systemic, preferring utility over display variety.
- **Title (`1.125rem`, 600 weight)**: Provides clear heading structures.
- **Text (`0.875rem`, 400 weight)**: The workhorse font for body and list content.
- **Tag (`0.625rem`)**: Hyper-compact sizes specifically for UI chips, meta information, and badges, often overlaid on imagery.
Text hierarchy is often achieved by utilizing the `.secondary` class, deferring to the theme-aware `--color-text-secondary`.

## Layout & Numeric Increments (NI)
At the core of the layout logic is the **Numeric Increment (`--ni-X`)** system. All spatial values map precisely to `rem` sizes representing pixels in a standard 16px base grid (e.g., `--ni-16` is `1rem`, `--ni-8` is `0.5rem`). This acts as the single source of truth for structural integrity.
- **Gaps & Margins**: Sourced from a semantic layer (`--gap-xs` up to `--gap-xxl`), powered directly by `ni` increments.
- **Dynamic Cards**: Media cards operate on complex SCSS mixins and container queries, adjusting aspect ratios depending on media context (Portrait `1:1.5` for movies, Landscape `1:1.78` for episodes/summaries).

## Elevation & Depth
Depth is created by meticulously stacked z-index layers (`layer-base` to `layer-top`) paired with sophisticated shadow tokens.
Shadows are inherently context-aware, using `color-mix()` against a theme-provided `--color-shadow`. This prevents "muddy" or invisible shadows in dark mode and ensures that floating elements (like dialogs, menus, and sticky navbars) naturally lift off the surface below them.

## Shapes & Corner Radii
Borders utilize soft, tactile shapes ranging from `xs` (4px) to `xxl` (24px). The softening of corners contrasts the rigid, rectangular nature of movie posters, making the interface feel modern and inviting without turning completely pill-shaped.

## Motion & Interaction
Animations are snappy and purposeful. The base animation token is `--transition-increment` (150ms).
- Standard interactions (hovers, focus, toggles) slide and fade at this 150ms cadence.
- Delightful micro-interactions (using keyframes like `jiggle-wiggle`, `loopy-loop`, or `lift-and-swing`) exist for engaging user feedback, running at multiples of the transition increment (e.g., 450ms) to feel bouncy and organic.