// Continuous brand-purple ramp shared by the pulse graphs: a bar's colour is
// mixed from the light and deep viz slots by its `--viz-bar-strength` (0-1),
// resolved entirely in CSS so callers only forward the numeric strength. `clamp`
// keeps the color-mix percentage valid even for a stray out-of-range value.
export const STRENGTH_RAMP_COLOR =
  'color-mix(in oklab, var(--viz-3), var(--viz-5) clamp(0%, calc(var(--viz-bar-strength) * 100%), 100%))';
