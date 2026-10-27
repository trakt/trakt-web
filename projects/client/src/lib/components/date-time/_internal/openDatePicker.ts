export function openDatePicker(input: HTMLInputElement) {
  if (typeof input.showPicker !== 'function') {
    input.focus();
    return;
  }

  try {
    input.showPicker();
  } catch {
    input.focus();
  }
}
