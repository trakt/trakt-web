import type { MixtapeVectors } from '$lib/requests/models/MixtapeVectors.ts';
import { decodeMixtapeVector } from './decodeMixtapeVector.ts';

type Fit = { id: number; score: number };

type LocalFitsParams = {
  picks: ReadonlyArray<number>;
  candidates: ReadonlyArray<number>;
  vectors: MixtapeVectors;
};

function cosine(a: Int8Array, b: Int8Array): number {
  const { dot, normA, normB } = a.reduce(
    (sums, value, index) => {
      const other = b[index] ?? 0;
      return {
        dot: sums.dot + value * other,
        normA: sums.normA + value * value,
        normB: sums.normB + other * other,
      };
    },
    { dot: 0, normA: 0, normB: 0 },
  );
  return normA === 0 || normB === 0 ? 0 : dot / Math.sqrt(normA * normB);
}

export function scoreLocalFits(
  { picks, candidates, vectors }: LocalFitsParams,
): Fit[] | null {
  const decode = (id: number) => {
    const encoded = vectors.vectors[String(id)];
    return encoded ? decodeMixtapeVector(encoded) : null;
  };

  const pickVectors = picks
    .map(decode)
    .filter((vector): vector is Int8Array => vector != null);
  if (pickVectors.length === 0 || pickVectors.length !== picks.length) {
    return null;
  }

  return candidates
    .filter((id) => !picks.includes(id))
    .flatMap((id) => {
      const vector = decode(id);
      if (!vector) return [];
      const score = Math.min(
        ...pickVectors.map((pick) => cosine(pick, vector)),
      );
      return score >= vectors.cutoff ? [{ id, score }] : [];
    })
    .sort((a, b) => b.score - a.score);
}
