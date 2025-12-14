import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useContentObserver } from './useContentObserver.ts';

describe('action: useDynamicTextArea', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
  });

  it('should initialize with no content', async () => {
    const { hasContent } = useContentObserver();
    expect(await firstValueFrom(hasContent)).toBe(false);
  });

  it('should detect content when text is added', async () => {
    const textArea = document.createElement('textarea');
    const { contentObserver, hasContent } = useContentObserver();
    const action = contentObserver(textArea);

    textArea.value = 'test';
    textArea.dispatchEvent(new Event('input'));

    vi.advanceTimersToNextFrame();

    expect(await firstValueFrom(hasContent)).toBe(true);
    action.destroy();
  });
});
