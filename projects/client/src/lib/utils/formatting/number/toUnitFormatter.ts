type UnitFormatOptions = Omit<Intl.NumberFormatOptions, 'style' | 'unit'>;

type ToUnitFormatterProps = {
  locale: string;
  unit: string;
  suffix: string;
  options?: UnitFormatOptions;
};

function createUnitFormat({
  locale,
  unit,
  options,
}: Omit<ToUnitFormatterProps, 'suffix'>): Intl.NumberFormat | null {
  try {
    return new Intl.NumberFormat(locale, { ...options, style: 'unit', unit });
  } catch {
    return null;
  }
}

export function toUnitFormatter({
  locale,
  unit,
  suffix,
  options,
}: ToUnitFormatterProps): (value: number) => string {
  const unitFormat = createUnitFormat({ locale, unit, options });
  const decimalFormat = new Intl.NumberFormat(locale, options);
  const toFallback = (value: number) =>
    `${decimalFormat.format(value)}${suffix}`;

  return (value) => {
    if (!unitFormat) return toFallback(value);

    try {
      return unitFormat.format(value);
    } catch {
      return toFallback(value);
    }
  };
}
