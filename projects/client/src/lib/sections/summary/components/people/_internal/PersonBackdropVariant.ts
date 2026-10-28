/**
 * Which treatment sits behind a person in the masthead header.
 *
 * `headshot` is the default: it was the chosen option, and unlike the others it
 * cannot fail - a person always has a headshot, whereas `credit` and `colors` both
 * depend on their film credits carrying artwork.
 *
 * The other three stay reachable through the search parameter, so the comparison
 * that settled this is still one URL away rather than gone from the code.
 */
export type PersonBackdropVariant = 'none' | 'credit' | 'headshot' | 'colors';

const VARIANTS: ReadonlyArray<PersonBackdropVariant> = [
  'none',
  'credit',
  'headshot',
  'colors',
];

const DEFAULT_VARIANT: PersonBackdropVariant = 'headshot';

/** The search parameter that selects the treatment, e.g. `?backdrop=credit`. */
export const PERSON_BACKDROP_PARAM = 'backdrop';

export function toPersonBackdropVariant(
  value: string | Nil,
): PersonBackdropVariant {
  return VARIANTS.find((variant) => variant === value) ?? DEFAULT_VARIANT;
}
