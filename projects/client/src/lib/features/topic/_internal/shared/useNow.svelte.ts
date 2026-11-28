type UseNowParams = { period: number };

export function useNow({ period }: UseNowParams) {
  let now = $state(Date.now());

  $effect(() => {
    const refresh = () => {
      if (!document.hidden) now = Date.now();
    };
    const timer = setInterval(refresh, period);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  });

  return {
    get value() {
      return now;
    },
  };
}
