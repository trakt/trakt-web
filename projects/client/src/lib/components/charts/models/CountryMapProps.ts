import type { Snippet } from 'svelte';

export type CountryMapDatum = {
  /** ISO 3166-1 alpha-2 code, lowercase (e.g. "us"), matching the geo asset. */
  code: string;
  value: number;
};

export type CountryMapTooltipArgs = CountryMapDatum;

export type CountryMapProps = {
  /** Per-country values; only these countries are tinted and interactive. */
  data: CountryMapDatum[];
  /** Rendered in the hovered country's tooltip. */
  tooltip?: Snippet<[CountryMapTooltipArgs]>;
};
