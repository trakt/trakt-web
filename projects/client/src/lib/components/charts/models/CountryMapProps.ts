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
   * URL of a GeoJSON FeatureCollection whose features expose a lowercase
   * alpha-2 `code` property. Defaults to the bundled world map.
   */
  geoUrl?: string;
  /**
   * Resolves the fill for a value (with the dataset max for normalization).
   * Defaults to a graduated red scale.
   */
  colorFor?: (value: number, max: number) => string;
  /** Rendered, pointer-anchored, for the hovered country. */
  tooltip?: Snippet<[CountryMapTooltipArgs]>;
};
