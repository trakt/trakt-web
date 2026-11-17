<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import { onDestroy, onMount, untrack } from "svelte";
  import { flyOrb } from "./_internal/flyOrb.ts";
  import { getRecentPointer } from "./_internal/getRecentPointer.ts";
  import { trackLastPointer } from "./_internal/trackLastPointer.ts";
  import OnboardingBurst from "./_internal/OnboardingBurst.svelte";
  import type { OnboardingSetProgress } from "./models/OnboardingSetProgress.ts";

  const {
    progress,
    orbOrigin = null,
    onFinished,
  }: {
    progress: OnboardingSetProgress;
    orbOrigin?: Element | null;
    onFinished?: () => void;
  } = $props();

  const BURST_MS = 800;
  const TOAST_MS = 1500;
  const FINISHED_LINGER_MS = 1000;
  const ORB_TIMEOUT_MS = 1200;
  const RADIUS = 10;
  const GAP = 2.4;

  const statuses = $derived(progress.steps.map(({ status }) => status));
  const isEarned = $derived(progress.isEarned);
  const total = $derived(statuses.length);
  const done = $derived(statuses.filter((status) => status === "done").length);
  const circumference = 2 * Math.PI * RADIUS;
  const segmentLength = $derived(total > 0 ? circumference / total : 0);

  let shownDone = $state(untrack(() => done));
  let track: SVGSVGElement | undefined = $state();
  let previousDone = $state(untrack(() => done));
  let burstId = $state(0);
  let toast = $state<{ title: string; sub: string } | null>(null);
  let burstTimeout: ReturnType<typeof setTimeout> | null = null;
  let toastTimeout: ReturnType<typeof setTimeout> | null = null;
  let landTimeout: ReturnType<typeof setTimeout> | null = null;
  let finishedTimeout: ReturnType<typeof setTimeout> | null = null;
  let hasFinished = false;
  let isDestroyed = false;

  const isShownDone = $derived(
    statuses.map(
      (status, index) =>
        status === "done" &&
        statuses.slice(0, index).filter((earlier) => earlier === "done")
          .length < shownDone,
    ),
  );
  const nextIndex = $derived(
    statuses.findIndex(
      (status, index) => status !== "skipped" && !isShownDone.at(index),
    ),
  );

  const segments = $derived(
    statuses.map((status, index) => ({
      index,
      tone: isShownDone.at(index)
        ? "done"
        : status === "skipped"
          ? "skipped"
          : index === nextIndex
            ? "next"
            : "rest",
      dasharray: `${Math.max(0, segmentLength - GAP)} ${
        circumference - segmentLength + GAP
      }`,
      dashoffset: -(index * segmentLength) - GAP / 2,
    })),
  );

  function celebrate(landed: number) {
    shownDone = landed;
    burstId += 1;
    if (burstTimeout) clearTimeout(burstTimeout);
    burstTimeout = setTimeout(() => (burstId = 0), BURST_MS);

    const earned = landed >= total;
    toast = {
      title: m.onboarding_toast_title({ done: landed, total }),
      sub: earned ? m.onboarding_toast_done() : "",
    };
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => (toast = null), TOAST_MS);

    if (!earned || hasFinished) return;
    hasFinished = true;
    finishedTimeout = setTimeout(
      () => onFinished?.(),
      TOAST_MS + FINISHED_LINGER_MS,
    );
  }

  function originOf(element: Element | null) {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  $effect(() => {
    const next = done;
    const previous = untrack(() => previousDone);
    previousDone = next;
    if (next <= previous) {
      shownDone = next;
      return;
    }

    const origin = untrack(() => originOf(orbOrigin)) ?? getRecentPointer();
    const target = untrack(() => track);
    if (!origin || !target) {
      celebrate(next);
      return;
    }

    let landed = false;
    const land = () => {
      if (landed || isDestroyed) return;
      landed = true;
      celebrate(next);
    };
    if (landTimeout) clearTimeout(landTimeout);
    landTimeout = setTimeout(land, ORB_TIMEOUT_MS);
    flyOrb({ from: origin, to: target }).then(land);
  });

  onMount(trackLastPointer);

  onDestroy(() => {
    isDestroyed = true;
    if (landTimeout) clearTimeout(landTimeout);
    if (burstTimeout) clearTimeout(burstTimeout);
    if (toastTimeout) clearTimeout(toastTimeout);
    if (finishedTimeout) clearTimeout(finishedTimeout);
  });
</script>

<span
  class="trakt-onboarding-ring"
  class:is-bursting={burstId > 0}
  class:is-toasting={toast != null}
  aria-hidden="true"
>
  <span class="ring-toast" class:is-on={toast != null}>
    {#if toast}
      <span class="ring-toast-text">
        <span class="ring-toast-title">{toast.title}</span>
        {#if toast.sub}
          <span class="ring-toast-sub">{toast.sub}</span>
        {/if}
      </span>
    {/if}
  </span>
  <svg class="ring-track" viewBox="0 0 24 24" bind:this={track}>
    {#each segments as segment (segment.index)}
      <circle
        class="ring-segment"
        data-tone={segment.tone}
        cx="12"
        cy="12"
        r={RADIUS}
        stroke-dasharray={segment.dasharray}
        stroke-dashoffset={segment.dashoffset}
      />
    {/each}
  </svg>
  {#key shownDone}
    <span class="ring-value">
      {#if isEarned}
        <span class="ring-check"><CheckIcon /></span>
      {:else}
        <span class="ring-digit">{shownDone}</span>
      {/if}
    </span>
  {/key}
  {#if burstId > 0}
    {#key burstId}
      <span class="ring-wave"></span>
      <OnboardingBurst radius="var(--ni-20)" count={isEarned ? 12 : 8} />
    {/key}
  {/if}
</span>
<span class="ring-status" role="status">
  {#if toast}{toast.title} {toast.sub}{/if}
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .ring-status {
    @include visually-hidden;
  }

  .trakt-onboarding-ring {
    --onboarding-ring-size: var(--nav-icon-size, var(--ni-24));
    --onboarding-ring-done: var(--color-accent-purple);
    --onboarding-ring-next: color-mix(
      in srgb,
      var(--color-accent-purple) 38%,
      transparent
    );
    --onboarding-ring-rest: color-mix(in srgb, currentColor 16%, transparent);
    --onboarding-ring-skipped: color-mix(in srgb, currentColor 45%, transparent);

    position: relative;
    display: inline-grid;
    place-items: center;
    width: var(--onboarding-ring-size);
    height: var(--onboarding-ring-size);
    flex-shrink: 0;

    &.is-bursting {
      animation: onboarding-ring-pop 420ms var(--transition-spring-ease);
    }

    &.is-toasting {
      z-index: var(--layer-raised);
    }
  }

  .ring-track {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    overflow: visible;
  }

  .ring-segment {
    fill: none;
    stroke: var(--onboarding-ring-rest);
    stroke-width: 1.75;
    stroke-linecap: round;
    transition: stroke 400ms ease-out;

    &[data-tone="done"] {
      stroke: var(--onboarding-ring-done);
    }

    &[data-tone="next"] {
      stroke: var(--onboarding-ring-next);
    }

    &[data-tone="skipped"] {
      stroke: var(--onboarding-ring-skipped);
    }
  }

  .ring-toast {
    --onboarding-toast-height: var(--ni-44);
    --onboarding-toast-inset: calc(
      (var(--onboarding-toast-height) - var(--onboarding-ring-size)) / -2
    );
    position: absolute;
    top: var(--onboarding-toast-inset);
    inset-inline-start: var(--onboarding-toast-inset);
    height: var(--onboarding-toast-height);
    width: var(--onboarding-toast-height);
    border-radius: var(--border-radius-xl);
    background: color-mix(in srgb, var(--color-card-background) 96%, transparent);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--color-foreground) 8%, transparent),
      inset 0 0 0 1px color-mix(in srgb, var(--color-accent-purple) 35%, transparent),
      0 var(--ni-12) var(--ni-30) color-mix(in srgb, var(--color-shadow) 45%, transparent);
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition:
      width 460ms cubic-bezier(0.3, 1.15, 0.5, 1),
      opacity 200ms 380ms;

    &.is-on {
      width: var(--ni-256);
      opacity: 1;
      transition:
        width 460ms cubic-bezier(0.3, 1.15, 0.5, 1),
        opacity 200ms;
    }
  }

  .ring-toast-text {
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-start: calc(var(--onboarding-toast-height) + var(--ni-10));
    display: flex;
    flex-direction: column;
    justify-content: center;
    white-space: nowrap;
    text-align: start;
    opacity: 0;
    animation: onboarding-toast-text 220ms 200ms ease-out forwards;
  }

  .ring-toast-title {
    font-size: calc(var(--ni-12) + var(--ni-1));
    line-height: calc(var(--ni-16) + var(--ni-1));
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .ring-toast-sub {
    font-size: var(--ni-12);
    line-height: var(--ni-16);
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .ring-value {
    position: relative;
    display: grid;
    place-items: center;
    animation: onboarding-value-pop 420ms var(--transition-spring-ease);
  }

  .ring-digit {
    font-size: calc(var(--onboarding-ring-size) * 0.46);
    line-height: 1;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .ring-check {
    display: grid;
    place-items: center;
    width: calc(var(--onboarding-ring-size) * 0.42);
    height: calc(var(--onboarding-ring-size) * 0.42);
    color: var(--color-accent-purple);
  }

  .trakt-onboarding-ring .ring-check :global(svg) {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .ring-wave {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: 0 0 0 1.5px
      color-mix(in srgb, var(--color-accent-purple) 90%, var(--shade-10));
    pointer-events: none;
    animation: onboarding-ring-wave 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  @keyframes onboarding-toast-text {
    to {
      opacity: 1;
    }
  }

  @keyframes onboarding-ring-wave {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(2.3);
    }
  }

  @keyframes onboarding-ring-pop {
    0% {
      transform: scale(1);
    }
    35% {
      transform: scale(1.18);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes onboarding-value-pop {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    60% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-onboarding-ring,
    .ring-value,
    .ring-wave {
      animation: none;
    }

    .ring-segment {
      transition: none;
    }

    .ring-toast,
    .ring-toast.is-on {
      transition: none;
    }

    .ring-toast-text {
      animation: none;
      opacity: 1;
    }
  }
</style>
