export type MemberCountProps = {
  // Passed in rather than fetched here, so the page owns the single poll.
  count: {
    /** Live projected total; the fractional part drives the digit roll. */
    value: number;
    /** Highest value to reserve layout width for. */
    reserveFor: number;
  };
};
