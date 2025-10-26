import { vi } from 'vitest';

vi.mock('$lib/features/confirmation/useConfirm.ts', () => ({
  useConfirm: vi.fn(() => ({
    confirm: vi.fn((props) => async () => {
      await props.onConfirm();
    }),
  })),
}));
