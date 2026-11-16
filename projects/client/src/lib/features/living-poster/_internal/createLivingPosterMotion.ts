import type { Attachment } from 'svelte/attachments';
import type { LivingPosterPainter } from '../models/LivingPosterPainter.ts';
import type { SpringState } from '../models/SpringState.ts';
import { idleTilt } from './idleTilt.ts';
import { stepSpring } from './stepSpring.ts';
import { toPointerTilt } from './toPointerTilt.ts';

const TILT_STIFFNESS = 140;
const TILT_DAMPING = 15;
const LIFT_STIFFNESS = 80;
const LIFT_DAMPING = 16;
const MAX_FRAME_SECONDS = 1 / 30;
const VISIBILITY_MARGIN = '120px';

type MotionState = {
  x: SpringState;
  y: SpringState;
  lift: SpringState;
  pointer: { x: number; y: number } | null;
  previousMilliseconds: number | null;
  startMilliseconds: number | null;
};

const AT_REST: SpringState = { value: 0, velocity: 0 };

export function createLivingPosterMotion() {
  const painters = new Set<LivingPosterPainter>();
  const phase = Math.random() * Math.PI * 2;

  const addPainter = (painter: LivingPosterPainter) => {
    painters.add(painter);

    return () => {
      painters.delete(painter);
    };
  };

  const root: Attachment<HTMLElement> = (element) => {
    const host = element.parentElement ?? element;
    const state: MotionState = {
      x: AT_REST,
      y: AT_REST,
      lift: AT_REST,
      pointer: null,
      previousMilliseconds: null,
      startMilliseconds: null,
    };
    let frame = 0;
    let isInView = false;

    const render = (milliseconds: number) => {
      const start = state.startMilliseconds ?? milliseconds;
      state.startMilliseconds = start;

      const seconds = Math.min(
        MAX_FRAME_SECONDS,
        (milliseconds - (state.previousMilliseconds ?? milliseconds)) / 1000,
      );
      state.previousMilliseconds = milliseconds;

      const target = state.pointer ?? idleTilt({ milliseconds, phase });
      state.x = stepSpring({
        state: state.x,
        target: target.x,
        seconds,
        stiffness: TILT_STIFFNESS,
        damping: TILT_DAMPING,
      });
      state.y = stepSpring({
        state: state.y,
        target: target.y,
        seconds,
        stiffness: TILT_STIFFNESS,
        damping: TILT_DAMPING,
      });
      state.lift = stepSpring({
        state: state.lift,
        target: state.pointer ? 1 : 0,
        seconds,
        stiffness: LIFT_STIFFNESS,
        damping: LIFT_DAMPING,
      });

      element.style.setProperty('--rx', state.x.value.toFixed(4));
      element.style.setProperty('--ry', state.y.value.toFixed(4));
      element.style.setProperty('--lift', state.lift.value.toFixed(3));

      for (const paint of painters) {
        paint({ seconds: (milliseconds - start) / 1000 });
      }
    };

    const tick = (milliseconds: number) => {
      render(milliseconds);
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      const shouldRun = isInView && !document.hidden;
      element.dataset.paused = String(!shouldRun);

      if (shouldRun && frame === 0) {
        state.previousMilliseconds = null;
        frame = requestAnimationFrame(tick);
      }

      if (!shouldRun && frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const onpointermove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      state.pointer = toPointerTilt({
        pointer: event,
        rect: element.getBoundingClientRect(),
      });
    };

    const onpointerleave = () => {
      state.pointer = null;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? false;
        sync();
      },
      { rootMargin: VISIBILITY_MARGIN },
    );

    element.dataset.paused = 'true';
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    host.addEventListener('pointermove', onpointermove, { passive: true });
    host.addEventListener('pointerleave', onpointerleave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      host.removeEventListener('pointermove', onpointermove);
      host.removeEventListener('pointerleave', onpointerleave);
    };
  };

  return { root, addPainter };
}
