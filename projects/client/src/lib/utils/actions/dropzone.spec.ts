import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dropzone } from './dropzone.ts';

class MockFileList {
  private files: File[] = [];

  constructor(files: File[] = []) {
    this.files = files;

    // Make this array-like
    Object.defineProperty(this, 'length', {
      get: () => this.files.length,
    });

    // Allow array-like indexing
    for (let i = 0; i < this.files.length; i++) {
      Object.defineProperty(this, i, {
        get: () => this.files[i],
      });
    }
  }

  item(index: number): File | null {
    return this.files[index] || null;
  }
}

describe('dropzone', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Set up a clean container for each test
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    container.remove();
  });

  it('should add appropriate attributes to the element', () => {
    // Arrange
    const element = document.createElement('div');
    container.appendChild(element);

    // Act
    const action = dropzone(element);

    // Assert
    expect(element.tabIndex).toBe(0);
    expect(element.getAttribute('role')).toBe('button');
    expect(element.style.cursor).toBe('pointer');

    // Clean up
    action.destroy();
  });

  it('should trigger file input click when element is clicked', () => {
    // Arrange
    const element = document.createElement('div');
    container.appendChild(element);

    const action = dropzone(element);

    // Create a spy on the click method of HTMLElement
    const originalClick = HTMLInputElement.prototype.click;
    const clickSpy = vi.fn();
    HTMLInputElement.prototype.click = clickSpy;

    // Act
    element.click();

    // Assert
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // Clean up
    HTMLInputElement.prototype.click = originalClick;
    action.destroy();
  });

  it('should trigger file input click when Enter key is pressed', () => {
    // Arrange
    const element = document.createElement('div');
    container.appendChild(element);

    const action = dropzone(element);

    // Create a spy on the click method of HTMLElement
    const originalClick = HTMLInputElement.prototype.click;
    const clickSpy = vi.fn();
    HTMLInputElement.prototype.click = clickSpy;

    // Act
    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    element.dispatchEvent(keyEvent);

    // Assert
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // Clean up
    HTMLInputElement.prototype.click = originalClick;
    action.destroy();
  });

  it('should not trigger file input click for non-Enter keys', () => {
    // Arrange
    const element = document.createElement('div');
    container.appendChild(element);

    const action = dropzone(element);

    // Create a spy on the click method of HTMLElement
    const originalClick = HTMLInputElement.prototype.click;
    const clickSpy = vi.fn();
    HTMLInputElement.prototype.click = clickSpy;

    // Act
    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Space',
      bubbles: true,
    });
    element.dispatchEvent(keyEvent);

    // Assert
    expect(clickSpy).not.toHaveBeenCalled();

    // Clean up
    HTMLInputElement.prototype.click = originalClick;
    action.destroy();
  });

  it('should add dragover class when dragging over the element', () => {
    // Arrange
    const element = document.createElement('div');
    container.appendChild(element);

    const action = dropzone(element);

    // Act
    const dragOverEvent = new Event('dragover', { bubbles: true });
    Object.defineProperty(dragOverEvent, 'preventDefault', { value: vi.fn() });
    element.dispatchEvent(dragOverEvent);

    // Assert
    expect(element.classList.contains('dragover')).toBe(true);

    // Clean up
    action.destroy();
  });

  it('should remove dragover class when dragging leaves the element', () => {
    // Arrange
    const element = document.createElement('div');
    element.classList.add('dragover');
    container.appendChild(element);

    const action = dropzone(element);

    // Act
    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    Object.defineProperty(dragLeaveEvent, 'preventDefault', { value: vi.fn() });
    element.dispatchEvent(dragLeaveEvent);

    // Assert
    expect(element.classList.contains('dragover')).toBe(false);

    // Clean up
    action.destroy();
  });

  it('should handle dropped files', () => {
    // Arrange
    const element = document.createElement('div');
    element.classList.add('dragover');
    container.appendChild(element);

    const action = dropzone(element);
    const changeHandler = vi.fn();
    element.addEventListener('files', changeHandler);

    // Create a mock file
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const fileList = new MockFileList([file]);

    // Act
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: fileList,
      },
    });
    Object.defineProperty(dropEvent, 'preventDefault', { value: vi.fn() });
    Object.defineProperty(dropEvent, 'stopPropagation', { value: vi.fn() });
    element.dispatchEvent(dropEvent);

    // Assert
    expect(element.classList.contains('dragover')).toBe(false);
    expect(changeHandler).toHaveBeenCalledTimes(1);

    // Clean up
    element.removeEventListener('change', changeHandler);
    action.destroy();
  });

  it('should not trigger change event for empty drop', () => {
    // Arrange
    const element = document.createElement('div');
    container.appendChild(element);

    const action = dropzone(element);
    const changeHandler = vi.fn();
    element.addEventListener('files', changeHandler);

    // Empty file list
    const fileList = new MockFileList();

    // Act
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: fileList,
      },
    });
    Object.defineProperty(dropEvent, 'preventDefault', { value: vi.fn() });
    Object.defineProperty(dropEvent, 'stopPropagation', { value: vi.fn() });
    element.dispatchEvent(dropEvent);

    // Assert
    expect(changeHandler).not.toHaveBeenCalled();

    // Clean up
    element.removeEventListener('change', changeHandler);
    action.destroy();
  });

  it('should clean up event listeners on destroy', () => {
    // Arrange
    const element = document.createElement('div');
    container.appendChild(element);

    const action = dropzone(element);

    // Create spies for cleanup verification
    const originalRemoveEventListener = element.removeEventListener;
    const removeEventListenerSpy = vi.fn();
    element.removeEventListener = removeEventListenerSpy;

    // Act
    action.destroy();

    // Assert
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(5); // 5 events: click, keydown, dragover, dragleave, drop

    // Clean up
    element.removeEventListener = originalRemoveEventListener;
  });
});
