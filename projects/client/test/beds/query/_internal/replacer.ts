export function replacer(_: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      data: Array.from(value.entries()),
    };
  }

  return value;
}
