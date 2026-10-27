const MAX_INITIALS = 2;

export function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((part) => Array.from(part)[0]!.toLocaleUpperCase())
    .join('');
}
