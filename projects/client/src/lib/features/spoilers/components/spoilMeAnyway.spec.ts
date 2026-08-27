import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';
import { spoilMeAnyway } from './spoilMeAnyway.ts';

describe('action: spoilMeAnyway', () => {
  it('should remove spoilers on the entire comment', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() => spoilMeAnyway(commentNode, true));
    commentNode.dispatchEvent(new Event('click'));

    expect(commentNode.classList).not.toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });

  it('should remove spoilers in a comment', async () => {
    const commentNode = document.createElement('div');
    const spoilerNode = document.createElement('div');
    commentNode.appendChild(spoilerNode);
    spoilerNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() => spoilMeAnyway(commentNode, true));
    spoilerNode.dispatchEvent(new Event('click', { bubbles: true }));

    expect(spoilerNode.classList).not.toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });

  it('should prevent the default action when revealing', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() => spoilMeAnyway(commentNode, true));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    commentNode.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);

    component.destroy();
  });

  it('should let the click through when nothing is hidden', async () => {
    const commentNode = document.createElement('div');

    const component = await renderStore(() => spoilMeAnyway(commentNode, true));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    commentNode.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);

    component.destroy();
  });

  it('should keep spoilers when the variant is persistent', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() =>
      spoilMeAnyway(commentNode, false)
    );
    commentNode.dispatchEvent(new Event('click'));

    expect(commentNode.classList).toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });
});
