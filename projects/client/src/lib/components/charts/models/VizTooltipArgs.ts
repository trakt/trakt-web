/**
 * Payload handed to every primitive's tooltip snippet. Uniform across charts so
 * a tooltip authored for one viz drops into another unchanged.
 */
export type VizTooltipArgs = {
  value: number;
  label: string;
  index: number;
};
