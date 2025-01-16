export function buildParamString(
  params: Record<string, string | number | Nil>,
): string {
  const values = Object
    .entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null,
    );

  if (!values.length) {
    return '';
  }

  const query = values.reduce((params, [key, value]) => {
    params.append(key, String(value));
    return params;
  }, new URLSearchParams());

  return `?${query}`;
}
