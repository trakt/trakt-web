<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Modal from "$lib/components/dialogs/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    src,
    onConfirm,
    onClose,
  }: {
    src: string;
    onConfirm: (base64: string) => void;
    onClose: () => void;
  } = $props();

  const CANVAS_DIMENSION = 440;
  const MIN_ZOOM_SCALE = 1;
  const MAX_ZOOM_SCALE = 4;
  const ZOOM_SCALE_STEP = 0.3;
  const WHEEL_ZOOM_SENSITIVITY = 0.005;
  const WHEEL_ZOOM_LINE_HEIGHT_PX = 20;
  const WHEEL_ZOOM_MAX_DELTA = 0.2;

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

  const dragAnchor = { x: 0, y: 0, offsetX: 0, offsetY: 0 };

  function clampOffsets(x: number, y: number, currentScale: number) {
    const { img } = refs;
    if (!img) return { x, y };

    const renderedW = img.naturalWidth * currentScale;
    const renderedH = img.naturalHeight * currentScale;
    const maxX = Math.max(0, (renderedW - CANVAS_DIMENSION) / 2);
    const maxY = Math.max(0, (renderedH - CANVAS_DIMENSION) / 2);

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

    ctx.clearRect(0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION);

    const naturalAspect = img.naturalWidth / img.naturalHeight;
    const [baseW, baseH] =
      naturalAspect >= 1
        ? [CANVAS_DIMENSION * naturalAspect, CANVAS_DIMENSION]
        : [CANVAS_DIMENSION, CANVAS_DIMENSION / naturalAspect];

    const drawW = baseW * crop.scale;
    const drawH = baseH * crop.scale;
    const drawX = (CANVAS_DIMENSION - drawW) / 2 + crop.offsetX;
    const drawY = (CANVAS_DIMENSION - drawH) / 2 + crop.offsetY;

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

  function onPointerDown(ev: PointerEvent) {
    crop.isDragging = true;
    dragAnchor.x = ev.clientX;
    dragAnchor.y = ev.clientY;
    dragAnchor.offsetX = crop.offsetX;
    dragAnchor.offsetY = crop.offsetY;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev: PointerEvent) {
    if (!crop.isDragging) return;

    const dx = ev.clientX - dragAnchor.x;
    const dy = ev.clientY - dragAnchor.y;
    const clamped = clampOffsets(
      dragAnchor.offsetX + dx,
      dragAnchor.offsetY + dy,
      crop.scale,
    );
    crop.offsetX = clamped.x;
    crop.offsetY = clamped.y;
  }

  const onPointerUp = () => {
    crop.isDragging = false;
  };

  function onWheel(ev: WheelEvent) {
    ev.preventDefault();
    crop.zoomTransition = false;
    const rawPixels =
      ev.deltaMode === 1 ? ev.deltaY * WHEEL_ZOOM_LINE_HEIGHT_PX : ev.deltaY;
    const delta = Math.max(
      -WHEEL_ZOOM_MAX_DELTA,
      Math.min(WHEEL_ZOOM_MAX_DELTA, -(rawPixels * WHEEL_ZOOM_SENSITIVITY)),
    );
    zoom(delta);
  }

  function zoom(delta: number) {
    const newScale = Math.min(
      MAX_ZOOM_SCALE,
      Math.max(MIN_ZOOM_SCALE, crop.scale + delta),
    );
    const clamped = clampOffsets(crop.offsetX, crop.offsetY, newScale);
    crop.scale = newScale;
    crop.offsetX = clamped.x;
    crop.offsetY = clamped.y;
  }

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
        width={CANVAS_DIMENSION}
        height={CANVAS_DIMENSION}
        class="crop-canvas"
        class:is-dragging={crop.isDragging}
        onpointerdown={onPointerDown}
        onpointermove={onPointerMove}
        onpointerup={onPointerUp}
        onpointercancel={onPointerUp}
        onwheel={onWheel}
        style="touch-action: none;"
      ></canvas>
    </div>

    <div class="crop-zoom-controls">
      <button
        class="zoom-btn"
        aria-label="Zoom out"
        onclick={() => {
          crop.zoomTransition = true;
          zoom(-ZOOM_SCALE_STEP);
        }}
        disabled={crop.scale <= MIN_ZOOM_SCALE}
      >
        &minus;
      </button>
      <div class="zoom-track">
        <div
          class="zoom-fill"
          class:animated={crop.zoomTransition}
          style="width: {((crop.scale - MIN_ZOOM_SCALE) /
            (MAX_ZOOM_SCALE - MIN_ZOOM_SCALE)) *
            100}%"
        ></div>
      </div>
      <button
        class="zoom-btn"
        aria-label="Zoom in"
        onclick={() => {
          crop.zoomTransition = true;
          zoom(ZOOM_SCALE_STEP);
        }}
        disabled={crop.scale >= MAX_ZOOM_SCALE}
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
