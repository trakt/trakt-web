export type PersonStat = {
  key: string;
  /** Uppercase label, e.g. "Movies". */
  label: string;
  /** The figure, e.g. "24". */
  value: string;
  /** Where the drilldown for this stat lives. */
  href: string;
};
