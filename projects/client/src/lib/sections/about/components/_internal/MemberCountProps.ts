export type MemberCountProps = {
  // Passed in rather than fetched here, so the page owns the single poll.
  count: {
    value: number;
  };
};
