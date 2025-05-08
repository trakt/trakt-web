export function dropzone(element: HTMLElement) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  input.setAttribute('aria-hidden', 'true');

  element.tabIndex = 0;
  element.setAttribute('role', 'button');
  element.style.cursor = 'pointer';

  const propagateChange = (files?: FileList) => {
    const changeEv = new CustomEvent('files', {
      bubbles: true,
      detail: { files },
    });
    element.dispatchEvent(changeEv);
  };

  const propagateChangeEvent = (ev: Event) => {
    if (ev.type === 'change' && input.files) {
      propagateChange(input.files);
    }
  };

  const triggerFileInput = () => {
    input.click();
  };

  const triggerOnEnter = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      triggerFileInput();
    }
  };

  const handleDragOver = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    element.classList.add('dragover');
  };

  const handleDragLeave = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    element.classList.remove('dragover');
  };

  const handleDrop = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    element.classList.remove('dragover');

    if (!ev.dataTransfer?.files.length) return;

    propagateChange(ev.dataTransfer.files);
  };

  input.addEventListener('change', propagateChangeEvent);
  element.addEventListener('click', triggerFileInput);
  element.addEventListener('keydown', triggerOnEnter);

  element.addEventListener('dragover', handleDragOver);
  element.addEventListener('dragleave', handleDragLeave);
  element.addEventListener('drop', handleDrop);

  return {
    destroy() {
      input.removeEventListener('change', propagateChangeEvent);
      element.removeEventListener('click', triggerFileInput);
      element.removeEventListener('keydown', triggerOnEnter);

      // Remove drag and drop event listeners
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    },
  };
}
