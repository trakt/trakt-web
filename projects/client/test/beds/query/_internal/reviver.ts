export function reviver(_: string, value: any) {
  const isMapValue = typeof value === 'object' && value?.dataType === 'Map';

  if (isMapValue) {
    return new Map(value.data);
  }

  return value;
}
