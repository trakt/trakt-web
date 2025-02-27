import { vi } from 'vitest';

vi.mock(import('$lib/features/i18n/messages.ts'), async (importOriginal) => {
  const originalMessages = await importOriginal();
  return {
    ...originalMessages,

    test_not_translated: () => undefined,
    test_translated_value: () => 'My Translated Value',

    test_counted_item: ({ count }: { count: number }) => `${count} items`,
    single_test_counted_item: ({ count }: { count: number }) => `${count} item`,
    single_test_not_translated: () => undefined,
  };
});
