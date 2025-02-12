import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';
import { spoilMeAnyway } from '$lib/sections/summary/components/comments/_internal/spoilMeAnyway.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';

describe('action: spoilMeAnyway', () => {
  it('should remove spoilers on the entire comment', async () => {
    const commentNode = document.createElement('div');
    commentNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() => spoilMeAnyway(commentNode));
    commentNode.dispatchEvent(new Event('click'));

    expect(commentNode.classList).not.toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });

  it('should remove spoilers in a comment', async () => {
    const commentNode = document.createElement('div');
    const spoilerNode = document.createElement('div');
    commentNode.appendChild(spoilerNode);
    spoilerNode.classList.add(SPOILER_CLASS_NAME);

    const component = await renderStore(() => spoilMeAnyway(commentNode));
    spoilerNode.dispatchEvent(new Event('click', { bubbles: true }));

    expect(spoilerNode.classList).not.toContain(SPOILER_CLASS_NAME);

    component.destroy();
  });
});
