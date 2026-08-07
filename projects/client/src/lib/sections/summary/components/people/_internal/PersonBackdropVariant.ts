/**
 * Which treatment sits behind a person in the masthead header.
 *
 * `none` is the default so the comparison starts from what is on screen today,
 * and so a reviewer opts into each option rather than being shown one.
 */
export type PersonBackdropVariant = 'none' | 'credit' | 'headshot' | 'colors';

const VARIANTS: ReadonlyArray<PersonBackdropVariant> = [
  'none',
  'credit',
  'headshot',
  'colors',
];

/** The search parameter that selects the treatment, e.g. `?backdrop=credit`. */
export const PERSON_BACKDROP_PARAM = 'backdrop';

export function toPersonBackdropVariant(
  value: string | Nil,
): PersonBackdropVariant {
  return VARIANTS.find((variant) => variant === value) ?? 'none';
}
