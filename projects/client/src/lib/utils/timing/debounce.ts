export function debounce<T>(func: (...args: T[]) => void, wait: number) {
  // deno-lint-ignore no-explicit-any
  let timeout: any;

  return function executedFunction(...args: T[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
