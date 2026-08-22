import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { autoDismiss } from './autoDismiss.ts';

const DURATION = 1000;

function mount({ persistent }: { persistent?: boolean } = {}) {
  const node = document.createElement('div');
  const onDismiss = vi.fn();

  return {
    node,
    onDismiss,
    action: autoDismiss(node, { onDismiss, durationMs: DURATION, persistent }),
  };
}

describe('action: autoDismiss', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should dismiss once the duration elapses', () => {
    const { onDismiss, action } = mount();

    vi.advanceTimersByTime(DURATION * 2);

    expect(onDismiss).toHaveBeenCalledOnce();
    action.destroy();
  });

  it('should report progress while counting down', () => {
    const { node, action } = mount();

    vi.advanceTimersByTime(DURATION / 2);

    expect(Number(node.style.getPropertyValue('--progress'))).to.be.greaterThan(
      0,
    );
    action.destroy();
  });

  it('should never dismiss when persistent', () => {
    const { onDismiss, action } = mount({ persistent: true });

    vi.advanceTimersByTime(DURATION * 10);

    expect(onDismiss).not.toHaveBeenCalled();
    action.destroy();
  });

  it('should not report progress when persistent', () => {
    const { node, action } = mount({ persistent: true });

    vi.advanceTimersByTime(DURATION * 10);

    expect(node.style.getPropertyValue('--progress')).to.equal('');
    action.destroy();
  });

  it('should stop counting down once destroyed', () => {
    const { onDismiss, action } = mount();

    action.destroy();
    vi.advanceTimersByTime(DURATION * 2);

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
