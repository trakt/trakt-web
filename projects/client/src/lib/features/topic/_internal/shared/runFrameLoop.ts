type RunFrameLoopParams = {
  fps?: number;
  frame: (seconds: number, delta: number) => void;
};

export function runFrameLoop({ fps = 60, frame }: RunFrameLoopParams) {
  const minStep = 1000 / fps - 1;
  const clock = { handle: 0, last: 0, elapsed: 0 };

  const tick = (now: number) => {
    clock.handle = requestAnimationFrame(tick);
    if (clock.last === 0) clock.last = now;
    const step = now - clock.last;
    if (step < minStep) return;
    clock.last = now;
    const delta = Math.min(step, 64) / 1000;
    clock.elapsed += delta;
    frame(clock.elapsed, delta);
  };

  const start = () => {
    if (clock.handle !== 0) return;
    clock.last = 0;
    clock.handle = requestAnimationFrame(tick);
  };

  const stop = () => {
    cancelAnimationFrame(clock.handle);
    clock.handle = 0;
  };

  const onVisibility = () => (document.hidden ? stop() : start());

  document.addEventListener('visibilitychange', onVisibility);
  if (!document.hidden) start();

  return () => {
    stop();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
