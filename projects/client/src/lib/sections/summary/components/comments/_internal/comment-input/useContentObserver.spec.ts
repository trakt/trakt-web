// get removed - use .value or firstValueFrom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useContentObserver } from './useContentObserver.ts';

describe('action: useDynamicTextArea', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
  });

  it('should initialize with no content', () => {
    const { hasContent } = useContentObserver();
    expect(hasContent.value).toBe(false);
  });

  it('should detect content when text is added', () => {
    const textArea = document.createElement('textarea');
    const { contentObserver, hasContent } = useContentObserver();
    const action = contentObserver(textArea);

    textArea.value = 'test';
    textArea.dispatchEvent(new Event('input'));

    vi.advanceTimersToNextFrame();

    expect(hasContent.value).toBe(true);
    action.destroy();
  });
});
