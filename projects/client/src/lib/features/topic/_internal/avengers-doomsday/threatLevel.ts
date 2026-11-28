const THREAT_LEVELS: Readonly<Record<string, number>> = {
  'new-premiere': 5,
  premiere: 4,
  'new-finale': 4,
  finale: 3,
  new: 2,
};

export function threatLevel(status: string): number | undefined {
  return THREAT_LEVELS[status];
}
