import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it, vi } from 'vitest';
import { spoilMeAnyway } from './spoilMeAnyway.ts';

describe('action: spoilMeAnyway', () => {
  it('should remove spoilers on the entire comment', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { isDismissible: true }),
    );
    commentNode.dispatchEvent(new Event('click'));

    expect(commentNode.classList).not.toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });

  it('should remove spoilers in a comment', async () => {
    const commentNode = document.createElement('div');
    const spoilerNode = document.createElement('div');
    commentNode.appendChild(spoilerNode);
    spoilerNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { isDismissible: true }),
    );
    spoilerNode.dispatchEvent(new Event('click', { bubbles: true }));

    expect(spoilerNode.classList).not.toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });

  it('should prevent the default action when revealing', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { isDismissible: true }),
    );
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    commentNode.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);

    component.destroy();
  });

  it('should let the click through when nothing is hidden', async () => {
    const commentNode = document.createElement('div');

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { isDismissible: true }),
    );
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    commentNode.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);

    component.destroy();
  });

  it('should keep spoilers when the variant is persistent', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { isDismissible: false }),
    );
    commentNode.dispatchEvent(new Event('click'));

    expect(commentNode.classList).toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });

  it('should report a reveal once per tap when nested nodes both reveal', async () => {
    const outerNode = document.createElement('div');
    const innerNode = document.createElement('div');
    outerNode.classList.add(SPOILER_CLASS_NAME);
    innerNode.classList.add(SPOILER_CLASS_NAME);
    outerNode.appendChild(innerNode);

    const onOuterReveal = vi.fn();
    const onInnerReveal = vi.fn();
    const outer = await renderStore(() =>
      spoilMeAnyway(outerNode, { onReveal: onOuterReveal }),
    );
    const inner = await renderStore(() =>
      spoilMeAnyway(innerNode, { onReveal: onInnerReveal }),
    );

    innerNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onInnerReveal).toHaveBeenCalledTimes(1);
    expect(onOuterReveal).not.toHaveBeenCalled();
    expect(outerNode.classList).not.toContain(SPOILER_CLASS_NAME);

    outer.destroy();
    inner.destroy();
  });

  it('should not report a reveal when nothing is hidden', async () => {
    const commentNode = document.createElement('div');
    const onReveal = vi.fn();

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { onReveal }),
    );
    commentNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onReveal).not.toHaveBeenCalled();

    component.destroy();
  });

  it('should not report a reveal when the variant is persistent', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);
    const onReveal = vi.fn();

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { isDismissible: false, onReveal }),
    );
    commentNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onReveal).not.toHaveBeenCalled();

    component.destroy();
  });

  it('should report a separate reveal for each tap', async () => {
    const commentNode = document.createElement('div');
    const onReveal = vi.fn();

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, { onReveal }),
    );
    commentNode.classList.add(SPOILER_CLASS_NAME);
    commentNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    commentNode.classList.add(SPOILER_CLASS_NAME);
    commentNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onReveal).toHaveBeenCalledTimes(2);

    component.destroy();
  });
});
