import type { MixtapeDoneProps } from './MixtapeDoneProps.ts';

export type MixtapeDoneWideProps = MixtapeDoneProps & {
  matchOf: (id: number) => number | null;
};
