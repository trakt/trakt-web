import type { Snippet } from 'svelte';

export type CountryMapDatum = {
  /** ISO 3166-1 alpha-2 code, lowercase (e.g. "us"), matching the geo asset. */
  code: string;
  value: number;
};

export type CountryMapTooltipArgs = {
  code: string;
  value: number;
};

export type CountryMapProps = {
  /** Per-country values; only these countries are tinted and interactive. */
  data: CountryMapDatum[];
  /**
   * URL of a TopoJSON whose `objects.countries` geometries expose a lowercase
   * alpha-2 `NAME` property (matched against each datum's `code`). Defaults to
   * the bundled world map.
   */
  geoUrl?: string;
  /** Rendered in the hovered country's tooltip. */
  tooltip?: Snippet<[CountryMapTooltipArgs]>;
};
