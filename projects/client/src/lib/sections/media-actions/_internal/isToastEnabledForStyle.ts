export function isToastEnabledForStyle(
  style: 'action' | 'normal' | 'dropdown-item',
): boolean {
  return style === 'dropdown-item';
}
