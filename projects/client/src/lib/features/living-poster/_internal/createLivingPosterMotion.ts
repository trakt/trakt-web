import type { Attachment } from 'svelte/attachments';
import type { LivingPosterPainter } from '../models/LivingPosterPainter.ts';
import type { OrientationAccess } from '../models/OrientationAccess.ts';
import type { SpringState } from '../models/SpringState.ts';
import { createOrientationSource } from './createOrientationSource.ts';
import { hasDragged } from './hasDragged.ts';
import { idleTilt } from './idleTilt.ts';
import { stepLowPass } from './stepLowPass.ts';
import { stepSpring } from './stepSpring.ts';
import { toDragTilt } from './toDragTilt.ts';
import { toPointerTilt } from './toPointerTilt.ts';

const TILT_STIFFNESS = 140;
const TILT_DAMPING = 15;
const LIFT_STIFFNESS = 80;
const LIFT_DAMPING = 16;
const TILT_SMOOTHING_SECONDS = 0.1;
const PRESENCE_SECONDS = 0.5;
const TILT_LIFT = 0.5;
const MAX_FRAME_SECONDS = 1 / 30;
const VISIBILITY_MARGIN = '120px';

type Tilt = { x: number; y: number };

type MotionState = {
  x: SpringState;
  y: SpringState;
  lift: SpringState;
  presence: number;
  pointer: Tilt | null;
  orientation: Tilt | null;
  dragStart: { clientX: number; clientY: number } | null;
  previousMilliseconds: number | null;
  startMilliseconds: number | null;
};

const AT_REST: SpringState = { value: 0, velocity: 0 };
const AT_REST_TILT: Tilt = { x: 0, y: 0 };

type SmoothTiltParams = {
  previous: Tilt | null;
  reading: Tilt;
  seconds: number;
};

function smoothTilt({ previous, reading, seconds }: SmoothTiltParams) {
  const smooth = (value: number | undefined, target: number) =>
    stepLowPass({
      value: value ?? target,
      target,
      seconds,
      timeConstant: TILT_SMOOTHING_SECONDS,
    });

  return {
    x: smooth(previous?.x, reading.x),
    y: smooth(previous?.y, reading.y),
  };
}

type CreateLivingPosterMotionParams = {
  onaccesschange?: (access: OrientationAccess) => void;
  ondrag?: () => void;
};

export function createLivingPosterMotion({
  onaccesschange,
  ondrag,
}: CreateLivingPosterMotionParams = {}) {
  const painters = new Set<LivingPosterPainter>();
  const phase = Math.random() * Math.PI * 2;
  let isReleased = false;
  const orientationSource = createOrientationSource({
    onaccesschange: (access) => onaccesschange?.(access),
  });

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
      presence: 0,
      pointer: null,
      orientation: null,
      dragStart: null,
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

      const reading = orientationSource.read();
      state.orientation = reading
        ? smoothTilt({ previous: state.orientation, reading, seconds })
        : null;

      const target = isReleased
        ? (state.pointer ??
          state.orientation ??
          idleTilt({ milliseconds, phase }))
        : AT_REST_TILT;
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
        target: !isReleased
          ? 0
          : state.pointer
            ? 1
            : state.orientation
              ? TILT_LIFT
              : 0,
        seconds,
        stiffness: LIFT_STIFFNESS,
        damping: LIFT_DAMPING,
      });

      element.style.setProperty('--rx', state.x.value.toFixed(4));
      element.style.setProperty('--ry', state.y.value.toFixed(4));
      state.presence = stepLowPass({
        value: state.presence,
        target: isReleased ? 1 : 0,
        seconds,
        timeConstant: PRESENCE_SECONDS,
      });

      element.style.setProperty('--lift', state.lift.value.toFixed(3));
      element.style.setProperty(
        '--reach',
        Math.min(1, Math.hypot(state.x.value, state.y.value)).toFixed(4),
      );
      element.style.setProperty('--presence', state.presence.toFixed(3));

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
      orientationSource.setActive(shouldRun);

      if (shouldRun && frame === 0) {
        state.previousMilliseconds = null;
        frame = requestAnimationFrame(tick);
      }

      if (!shouldRun && frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    let hasReportedDrag = false;
    let hasDraggedSincePointerDown = false;

    const dragTo = (event: PointerEvent) => {
      if (state.dragStart === null) return;

      state.pointer = toDragTilt({
        start: state.dragStart,
        current: event,
        rect: element.getBoundingClientRect(),
      });

      if (!hasDragged(state.pointer)) return;

      hasDraggedSincePointerDown = true;
      if (hasReportedDrag) return;

      hasReportedDrag = true;
      ondrag?.();
    };

    const onpointerdown = (event: PointerEvent) => {
      hasDraggedSincePointerDown = false;

      if (event.pointerType !== 'touch') return;
      if (orientationSource.read() !== null) return;

      state.dragStart = { clientX: event.clientX, clientY: event.clientY };
      dragTo(event);
    };

    const onpointermove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        dragTo(event);
        return;
      }

      state.pointer = toPointerTilt({
        pointer: event,
        rect: element.getBoundingClientRect(),
      });
    };

    const onpointerleave = () => {
      state.dragStart = null;
      state.pointer = null;
    };

    const onpointerend = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;

      onpointerleave();
    };

    const onpointercancel = (event: PointerEvent) => {
      hasDraggedSincePointerDown = false;
      onpointerend(event);
    };

    const onclickcapture = (event: MouseEvent) => {
      const isPointerClick = event.detail > 0;
      if (!hasDraggedSincePointerDown || !isPointerClick) return;

      hasDraggedSincePointerDown = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? false;
        sync();
      },
      { rootMargin: VISIBILITY_MARGIN },
    );

    element.dataset.paused = 'true';
    const disconnectOrientation = orientationSource.connect();
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    host.style.touchAction = 'pan-y pinch-zoom';
    host.addEventListener('pointerdown', onpointerdown, { passive: true });
    host.addEventListener('pointermove', onpointermove, { passive: true });
    host.addEventListener('pointerup', onpointerend);
    host.addEventListener('pointercancel', onpointercancel);
    host.addEventListener('pointerleave', onpointerleave);
    host.addEventListener('click', onclickcapture, { capture: true });

    return () => {
      cancelAnimationFrame(frame);
      disconnectOrientation();
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      host.style.touchAction = '';
      host.removeEventListener('pointerdown', onpointerdown);
      host.removeEventListener('pointermove', onpointermove);
      host.removeEventListener('pointerup', onpointerend);
      host.removeEventListener('pointercancel', onpointercancel);
      host.removeEventListener('pointerleave', onpointerleave);
      host.removeEventListener('click', onclickcapture, { capture: true });
    };
  };

  const release = () => {
    isReleased = true;
  };

  return {
    root,
    addPainter,
    release,
    requestTilt: orientationSource.requestAccess,
  };
}
