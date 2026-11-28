import { afterEach, describe, expect, it, vi } from 'vitest';
import { attachAll } from './attachAll.ts';

function addCard(className: string) {
  const element = document.createElement('div');
  element.className = className;
  return document.body.appendChild(element);
}

async function nextSweep() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

describe('util: attachAll', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should attach to elements already on the page', () => {
    const card = addCard('card');
    const attach = vi.fn();

    const detach = attachAll({ selector: '.card', attach });

    expect(attach).toHaveBeenCalledWith(card);
    detach();
  });

  it('should attach to elements added later, once each', async () => {
    const attach = vi.fn();
    const detach = attachAll({ selector: '.card', attach });

    const card = addCard('card');
    await nextSweep();
    addCard('other');
    await nextSweep();

    expect(attach).toHaveBeenCalledTimes(1);
    expect(attach).toHaveBeenCalledWith(card);
    detach();
  });

  it('should run the cleanup of elements that leave the page', async () => {
    const cleanup = vi.fn();
    const detach = attachAll({ selector: '.card', attach: () => cleanup });

    const card = addCard('card');
    await nextSweep();
    card.remove();
    await nextSweep();

    expect(cleanup).toHaveBeenCalledTimes(1);
    detach();
  });

  it('should serve several rules and keep watching until the last one detaches', async () => {
    const cards = vi.fn();
    const posters = vi.fn();
    const detachCards = attachAll({ selector: '.card', attach: cards });
    const detachPosters = attachAll({ selector: '.poster', attach: posters });

    detachCards();
    addCard('card');
    addCard('poster');
    await nextSweep();

    expect(cards).not.toHaveBeenCalled();
    expect(posters).toHaveBeenCalledTimes(1);
    detachPosters();
  });

  it('should run every cleanup on detach', () => {
    const cleanup = vi.fn();
    addCard('card');
    addCard('card');

    attachAll({ selector: '.card', attach: () => cleanup })();

    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});
