import { vi } from 'vitest';

vi.mock(import('$lib/features/i18n/messages.ts'), async (importOriginal) => {
  const originalMessages = await importOriginal();
  return {
    ...originalMessages,

    test_not_translated: () => undefined,
    test_translated_value: () => 'My Translated Value',
  };
});
