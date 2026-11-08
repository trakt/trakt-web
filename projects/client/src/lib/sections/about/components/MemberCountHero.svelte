<script lang="ts">
  import CounterNumber from "$lib/components/counter/CounterNumber.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MemberCountProps } from "./_internal/MemberCountProps.ts";
  import { toAnnounceValue } from "./_internal/toAnnounceValue.ts";
  import { toMemberCountLabel } from "./_internal/toMemberCountLabel.ts";

  const { count }: MemberCountProps = $props();

  const announced = $derived(
    count.value === null ? null : toAnnounceValue(count.value),
  );
  const accessibleLabel = $derived(
    announced === null ? "" : toMemberCountLabel(announced),
  );
</script>

<section class="trakt-member-count-hero">
  <div class="member-count-halo" aria-hidden="true"></div>
  <div class="member-count-ring" aria-hidden="true">
    <div class="ring-spin"><div class="ring-sweep"></div></div>
  </div>

  <p class="member-count-eyebrow tag uppercase">
    {m.label_registered_accounts()}
  </p>

  <div class="member-count-figure">
    {#if count.value === null}
      <div class="member-count-placeholder">
        <Skeleton width="5.6em" height="1em" radius="var(--border-radius-m)" />
      </div>
    {:else}
      <CounterNumber value={count.value} {accessibleLabel} />
    {/if}
  </div>

  <p class="member-count-tagline secondary">{m.text_member_count_tagline()}</p>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-member-count-hero {
    position: relative;
    isolation: isolate;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    box-sizing: border-box;
    width: 100%;
    padding: var(--gap-xl) var(--gap-m);

    text-align: center;

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
    box-shadow: var(--shadow-raised);

    @include for-mobile {
      padding-block: var(--gap-l);
    }
  }

  .member-count-halo {
    position: absolute;
    inset: 22% 12%;
    z-index: var(--layer-background);

    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      color-mix(in srgb, var(--purple-500) 50%, transparent),
      transparent 70%
    );
    filter: blur(var(--ni-14));

    animation: halo-breathe 5s ease-in-out infinite;
  }

  .member-count-ring {
    position: absolute;
    inset: 0;
    overflow: hidden;

    padding: var(--ni-1);
    border-radius: inherit;

    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;

    pointer-events: none;
  }

  .ring-spin {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 260%;
    aspect-ratio: 1;

    transform: translate(-50%, -50%);
    animation: ring-spin 6s linear infinite;
  }

  .ring-sweep {
    position: absolute;
    inset: 0;
    border-radius: 50%;

    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      color-mix(in srgb, var(--purple-400) 90%, transparent) 40deg,
      transparent 80deg,
      transparent 360deg
    );
  }

  .member-count-eyebrow {
    padding: var(--ni-6) var(--ni-14);

    letter-spacing: var(--ni-2);
    color: var(--purple-400);

    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
  }

  .member-count-figure {
    font-size: var(--ni-96);
    font-weight: 700;
    // The number is the headline, so the digits are set tighter than body copy.
    letter-spacing: -0.03em;
    line-height: 1;

    // Not a `background-clip: text` gradient: transformed strips contribute no
    // glyphs to a text clip, so a gradient renders only the separators.
    color: var(--color-text-primary);

    transition: font-size var(--transition-increment) ease-in-out;

    @include for-tablet-lg-and-below {
      font-size: var(--ni-72);
    }

    @include for-mobile {
      font-size: var(--ni-40);
    }
  }

  .member-count-placeholder {
    display: flex;
    justify-content: center;
  }

  .member-count-tagline {
    font-size: var(--ni-18);
    max-width: var(--ni-480);

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }

  @keyframes halo-breathe {
    0%,
    100% {
      opacity: 0.45;
      transform: scale(0.95);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }

  @keyframes ring-spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .member-count-halo,
    .ring-spin {
      animation: none;
    }
  }
</style>
