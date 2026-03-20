<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Modal from "$lib/components/dialogs/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromEvent, merge, Subject } from "rxjs";
  import { map, pairwise, scan, startWith, tap } from "rxjs/operators";

  const {
    src,
    onConfirm,
    onClose,
  }: {
    src: string;
    onConfirm: (base64: string) => void;
    onClose: () => void;
  } = $props();

  const canvasDimension = 440;
  const minZoomScale = 1;
  const maxZoomScale = 4;
  const zoomScaleStep = 0.3;
  const wheelZoomSensitivity = 0.005;
  const wheelZoomLineHeightPx = 20;
  const wheelZoomMaxDelta = 0.2;
  const pinchZoomSensitivity = 0.85;
  const trackpadPinchSensitivity = 0.02;

  const refs = $state<{ canvas?: HTMLCanvasElement; img?: HTMLImageElement }>(
    {},
  );

  const crop = $state({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    isImageLoaded: false,
    zoomTransition: false,
  });

  type Vec2 = { readonly x: number; readonly y: number };
  type PointerMap = ReadonlyMap<number, Vec2>;
  type PointerAction =
    | { readonly type: "down"; readonly id: number; readonly pos: Vec2 }
    | { readonly type: "move"; readonly id: number; readonly pos: Vec2 }
    | { readonly type: "remove"; readonly id: number };

  type CropEvent =
    | { readonly kind: "pan"; readonly dx: number; readonly dy: number }
    | { readonly kind: "zoom"; readonly delta: number; readonly transition: boolean }
    | { readonly kind: "dragging"; readonly active: boolean };

  const pinchDistance = (a: Vec2, b: Vec2) => Math.hypot(b.x - a.x, b.y - a.y);

  const zoomButton$ = new Subject<number>();

  function clampOffsets(x: number, y: number, currentScale: number) {
    const { img } = refs;
    if (!img) return { x, y };

    const renderedW = img.naturalWidth * currentScale;
    const renderedH = img.naturalHeight * currentScale;
    const maxX = Math.max(0, (renderedW - canvasDimension) / 2);
    const maxY = Math.max(0, (renderedH - canvasDimension) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }

  function draw() {
    const { canvas, img } = refs;
    if (!canvas || !img || !crop.isImageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasDimension, canvasDimension);

    const naturalAspect = img.naturalWidth / img.naturalHeight;
    const [baseW, baseH] =
      naturalAspect >= 1
        ? [canvasDimension * naturalAspect, canvasDimension]
        : [canvasDimension, canvasDimension / naturalAspect];

    const drawW = baseW * crop.scale;
    const drawH = baseH * crop.scale;
    const drawX = (canvasDimension - drawW) / 2 + crop.offsetX;
    const drawY = (canvasDimension - drawH) / 2 + crop.offsetY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  $effect(() => {
    draw();
  });

  function onImageLoad() {
    if (!refs.img) return;
    crop.isImageLoaded = true;
    crop.scale = 1;
    crop.offsetX = 0;
    crop.offsetY = 0;
    draw();
  }

  const applyCropEvent = (event: CropEvent) => {
    if (event.kind === "dragging") {
      crop.isDragging = event.active;
      return;
    }

    if (event.kind === "pan") {
      const clamped = clampOffsets(
        crop.offsetX + event.dx,
        crop.offsetY + event.dy,
        crop.scale,
      );
      crop.offsetX = clamped.x;
      crop.offsetY = clamped.y;
      return;
    }

    crop.zoomTransition = event.transition;
    const newScale = Math.min(
      maxZoomScale,
      Math.max(minZoomScale, crop.scale + event.delta),
    );
    const clamped = clampOffsets(crop.offsetX, crop.offsetY, newScale);
    crop.scale = newScale;
    crop.offsetX = clamped.x;
    crop.offsetY = clamped.y;
  };

  const updatePointers = (ptrs: PointerMap, action: PointerAction): PointerMap => {
    const next = new Map(ptrs);
    if (action.type === "remove") next.delete(action.id);
    else if (action.type === "down") next.set(action.id, action.pos);
    else if (next.has(action.id)) next.set(action.id, action.pos);
    return next as PointerMap;
  };

  const toCropEvent = ([prev, curr]: [PointerMap, PointerMap]): CropEvent => {
    const prevPtrs = [...prev.values()];
    const currPtrs = [...curr.values()];

    if (prevPtrs.length === 2 && currPtrs.length === 2) {
      const ratio = pinchDistance(currPtrs[0], currPtrs[1]) / pinchDistance(prevPtrs[0], prevPtrs[1]);
      return {
        kind: "zoom",
        delta: crop.scale * (1 + (ratio - 1) * pinchZoomSensitivity) - crop.scale,
        transition: false,
      };
    }

    if (prevPtrs.length === 1 && currPtrs.length === 1)
      return {
        kind: "pan",
        dx: currPtrs[0].x - prevPtrs[0].x,
        dy: currPtrs[0].y - prevPtrs[0].y,
      };

    return { kind: "dragging", active: currPtrs.length === 1 };
  };

  $effect(() => {
    const canvas = refs.canvas;
    if (!canvas) return;

    const gesture$ = merge(
      fromEvent<PointerEvent>(canvas, "pointerdown").pipe(
        tap((ev) => canvas.setPointerCapture(ev.pointerId)),
        map((ev): PointerAction => ({ type: "down", id: ev.pointerId, pos: { x: ev.clientX, y: ev.clientY } })),
      ),
      fromEvent<PointerEvent>(canvas, "pointermove").pipe(
        map((ev): PointerAction => ({ type: "move", id: ev.pointerId, pos: { x: ev.clientX, y: ev.clientY } })),
      ),
      merge(
        fromEvent<PointerEvent>(canvas, "pointerup"),
        fromEvent<PointerEvent>(canvas, "pointercancel"),
      ).pipe(map((ev): PointerAction => ({ type: "remove", id: ev.pointerId }))),
    ).pipe(
      scan(updatePointers, new Map<number, Vec2>()),
      startWith(new Map<number, Vec2>() as PointerMap),
      pairwise(),
      map(toCropEvent),
    );

    const wheel$ = fromEvent<WheelEvent>(canvas, "wheel").pipe(
      tap((ev) => ev.preventDefault()),
      map((ev): CropEvent => {
        // macOS trackpad pinch fires wheel events with ctrlKey
        if (ev.ctrlKey) {
          const delta = -ev.deltaY * trackpadPinchSensitivity * pinchZoomSensitivity;
          return { kind: "zoom", delta, transition: false };
        }
        const rawPixels =
          ev.deltaMode === 1 ? ev.deltaY * wheelZoomLineHeightPx : ev.deltaY;
        return {
          kind: "zoom",
          delta: Math.max(
            -wheelZoomMaxDelta,
            Math.min(wheelZoomMaxDelta, -(rawPixels * wheelZoomSensitivity)),
          ),
          transition: false,
        };
      }),
    );

    const buttonZoom$ = zoomButton$.pipe(
      map((step): CropEvent => ({ kind: "zoom", delta: step, transition: true })),
    );

    const sub = merge(gesture$, wheel$, buttonZoom$).subscribe(applyCropEvent);

    return () => sub.unsubscribe();
  });

  const exportCroppedBase64 = () =>
    refs.canvas?.toDataURL("image/jpeg", 0.9) ?? "";

  const handleConfirm = () => onConfirm(exportCroppedBase64());
</script>

<!-- Hidden image element used for drawing -->
<img
  bind:this={refs.img}
  {src}
  alt=""
  aria-hidden="true"
  style="display:none"
  onload={onImageLoad}
  crossorigin="anonymous"
/>

<Modal {onClose}>
  <div class="crop-dialog">
    <div class="crop-header">
      <ActionButton
        label={m.button_text_cancel()}
        color="default"
        style="ghost"
        onclick={onClose}
      >
        <CloseIcon />
      </ActionButton>
      <span class="crop-hint">{m.label_drag_image_to_adjust()}</span>
      <Button
        label={m.button_text_upload_photo()}
        color="default"
        style="ghost"
        size="small"
        onclick={handleConfirm}
      >
        {#snippet icon()}
          <CoverImageIcon />
        {/snippet}
        {m.button_text_upload_photo()}
      </Button>
    </div>

    <div class="crop-canvas-wrapper">
      <canvas
        bind:this={refs.canvas}
        width={canvasDimension}
        height={canvasDimension}
        class="crop-canvas"
        class:is-dragging={crop.isDragging}
        style="touch-action: none;"
      ></canvas>
    </div>

    <div class="crop-zoom-controls">
      <button
        class="zoom-btn"
        aria-label="Zoom out"
        onclick={() => zoomButton$.next(-zoomScaleStep)}
        disabled={crop.scale <= minZoomScale}
      >
        &minus;
      </button>
      <div class="zoom-track">
        <div
          class="zoom-fill"
          class:animated={crop.zoomTransition}
          style="width: {((crop.scale - minZoomScale) /
            (maxZoomScale - minZoomScale)) *
            100}%"
        ></div>
      </div>
      <button
        class="zoom-btn"
        aria-label="Zoom in"
        onclick={() => zoomButton$.next(zoomScaleStep)}
        disabled={crop.scale >= maxZoomScale}
      >
        +
      </button>
    </div>
  </div>
</Modal>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .crop-dialog {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    padding: 0;
  }

  .crop-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-8);
  }

  .crop-hint {
    font-size: var(--font-size-text);
    color: var(--color-text-secondary);
    flex: 1;
    text-align: center;
  }

  .crop-canvas-wrapper {
    position: relative;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    aspect-ratio: 1;
    width: 100%;
    background-color: var(--shade-900);
  }

  .crop-canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: grab;

    &.is-dragging {
      cursor: grabbing;
    }
  }

  .crop-zoom-controls {
    display: flex;
    align-items: center;
    gap: var(--ni-12);
  }

  .zoom-btn {
    all: unset;
    cursor: pointer;
    width: var(--ni-28);
    height: var(--ni-28);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-s);
    font-size: var(--font-size-l);
    color: var(--color-text-primary);
    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover:not(:disabled) {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .zoom-track {
    flex: 1;
    height: var(--ni-4);
    border-radius: var(--border-radius-s);
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 15%,
      transparent
    );
    overflow: hidden;
  }

  .zoom-fill {
    height: 100%;
    background-color: var(--color-foreground);
    border-radius: var(--border-radius-s);

    &.animated {
      transition: width calc(var(--transition-increment) * 2) ease-out;
    }
  }
</style>
