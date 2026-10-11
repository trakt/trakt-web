const ORIGIN_NAMES: Record<string, string> = {
  mdblist: 'MDBList',
};

export function toStaleOriginName(name: string): string {
  return ORIGIN_NAMES[name.toLowerCase()] ?? name;
}
