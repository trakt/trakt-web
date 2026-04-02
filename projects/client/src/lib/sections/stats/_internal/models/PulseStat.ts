export type PulseStat = {
  readonly key: string;
  readonly rawValue: number;
  readonly value: string;
  readonly label: string;
  readonly tooltip?: string;
  readonly delta: number | null;
  readonly note?: string;
};
