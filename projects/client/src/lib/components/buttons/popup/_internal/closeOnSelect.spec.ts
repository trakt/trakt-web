import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';
import { closeOnSelect } from './closeOnSelect.ts';

describe('closeOnSelect', () => {
  let node: HTMLElement;
  let close: Mock<() => void>;

  beforeEach(() => {
    node = document.createElement('ul');
    document.body.appendChild(node);
    close = vi.fn(() => {});
  });

  afterEach(() => {
    node.remove();
  });

  it('should close when the node is clicked', async () => {
    closeOnSelect(node, close);

    node.click();
    await Promise.resolve();

    expect(close).toHaveBeenCalledOnce();
  });

  it('should close when a child item is clicked', async () => {
    const item = document.createElement('li');
    node.appendChild(item);

    closeOnSelect(node, close);

    item.click();
    await Promise.resolve();

    expect(close).toHaveBeenCalledOnce();
  });

  it('should defer the close until the click has finished dispatching', async () => {
    closeOnSelect(node, close);

    node.click();
    expect(close).not.toHaveBeenCalled();

    await Promise.resolve();
    expect(close).toHaveBeenCalledOnce();
  });

  it('should NOT close when a child stops propagation', async () => {
    const item = document.createElement('li');
    item.addEventListener('click', (event) => event.stopPropagation());
    node.appendChild(item);

    closeOnSelect(node, close);

    item.click();
    await Promise.resolve();

    expect(close).not.toHaveBeenCalled();
  });

  it('should call the updated callback after update', async () => {
    const updated = vi.fn(() => {});
    const action = closeOnSelect(node, close);

    action.update(updated);
    node.click();
    await Promise.resolve();

    expect(close).not.toHaveBeenCalled();
    expect(updated).toHaveBeenCalledOnce();
  });

  it('should NOT close after destroy', async () => {
    const action = closeOnSelect(node, close);

    action.destroy();
    node.click();
    await Promise.resolve();

    expect(close).not.toHaveBeenCalled();
  });
});
