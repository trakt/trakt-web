export function runInDerived(compute: () => unknown): () => void {
  return $effect.root(() => {
    const value = $derived.by(compute);
    const evaluate = () => value;
    evaluate();
  });
}
