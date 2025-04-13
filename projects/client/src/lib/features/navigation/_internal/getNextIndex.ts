export const getNextIndex = (
  current: number,
  length: number,
  isForward: boolean,
) => {
  return isForward
    ? Math.min(current + 1, length - 1)
    : Math.max(current - 1, 0);
};
