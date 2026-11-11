export function toPosterLanguage(locale: string): string | null {
  const language = locale.split('-').at(0)?.toLowerCase();

  if (!language || language === 'en') return null;

  return language;
}
