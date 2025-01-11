export function assertDefined<T>(value: T | Nil, message?: string): T {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}
