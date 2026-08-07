export type SummaryHeaderFact = {
  key: string;
  /** Uppercase field label, rendered only by the labelled facts strip (1a). */
  label: string;
  /** Bare value, paired with {@link SummaryHeaderFact.label}. e.g. `"10"`. */
  value: string;
  /**
   * Self-describing form for the unlabelled meta line (1b), where there is no
   * label to carry the meaning. Identical to `value` for everything except
   * counts - `"10"` alone is meaningless, `"10 episodes"` is not.
   */
  inlineValue: string;
};
