const SCHEMA_ID = 'schema';

export function schemaId(key: string) {
  return `${SCHEMA_ID}:${key}`;
}
