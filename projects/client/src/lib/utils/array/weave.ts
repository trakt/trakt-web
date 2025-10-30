export function weave<A, B>(a: A[], b: B[]): Array<A | B> {
  const maxLength = Math.max(a.length, b.length);
  const result: Array<A | B> = [];

  for (let i = 0; i < maxLength; i++) {
    if (i < a.length) result.push(a[i] as A);
    if (i < b.length) result.push(b[i] as B);
  }

  return result;
}
