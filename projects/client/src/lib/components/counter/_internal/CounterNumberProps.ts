export type CounterNumberProps = {
  value: number;
  /**
   * Static, coarse description of the value. The digits are `aria-hidden`, so
   * this is all a screen reader hears - keep it coarse enough not to change on
   * a tick.
   */
  accessibleLabel: string;
};
