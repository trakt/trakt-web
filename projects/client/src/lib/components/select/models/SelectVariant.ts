/**
 * Structural presentation of a select control.
 *
 * - `regular`: polished, roomy trigger that floats over main views - mirrors
 *   the filter UI used in the filters view.
 * - `compact`: condensed trigger tuned for dense horizontal space inside
 *   drawers (advanced filtering, inline sorting panels).
 * - `selected-label`: icon-only squares except the selected option, which
 *   grows to show its label - the tightest labelled form, for small screens.
 */
export type SelectVariant = 'regular' | 'compact' | 'selected-label';
