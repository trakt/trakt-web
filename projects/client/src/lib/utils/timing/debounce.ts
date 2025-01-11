export function debounce<T>(func: (...args: T[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | number;

  return function executedFunction(...args: T[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
