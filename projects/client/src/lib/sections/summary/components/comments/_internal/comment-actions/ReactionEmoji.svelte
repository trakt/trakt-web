<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { time } from "$lib/utils/timing/time";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { EMOJI_BASE_URL } from "./constants";

  const {
    code,
    label,
    animation = "none",
    index,
  }: {
    code: string;
    label: string;
    index: number;
    animation?: "initial" | "infinite" | "none";
  } = $props();

  const baseUrl = $derived(`${EMOJI_BASE_URL}/${code}`);

  const hasInitialAnimation = writable(false);

  // FIXME: switch to Lottie animations for better control on the animation and reduce file size
  const hasAnimation = $derived(
    animation === "infinite" || $hasInitialAnimation,
  );

  onMount(() => {
    if (animation !== "initial") {
      return;
    }

    const duration = time.seconds(1.25);
    const delay = time.seconds(0.05) * (index + 1);

    const startTimeoutId = setTimeout(
      () => hasInitialAnimation.set(true),
      delay,
    );

    const endTimeoutId = setTimeout(
      () => hasInitialAnimation.set(false),
      delay + duration,
    );

    return () => {
      clearTimeout(startTimeoutId);
      clearTimeout(endTimeoutId);
    };
  });
</script>

<div class="trakt-reaction-emoji-container" class:is-animated={hasAnimation}>
  <picture class="trakt-reaction-emoji animated">
    <source srcset={`${baseUrl}/512.webp`} type="image/webp" />
    <CrossOriginImage loading="eager" src={`${baseUrl}/512.gif`} alt={label} />
  </picture>

  <picture class="trakt-reaction-emoji static">
    <CrossOriginImage
      loading="eager"
      src={`${baseUrl}/emoji.svg`}
      alt={label}
    />
  </picture>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reaction-emoji-container {
    .animated {
      display: none;
    }

    &.is-animated {
      .animated {
        display: flex;
      }

      .static {
        display: none;
      }
    }
  }

  .trakt-reaction-emoji {
    display: flex;
    justify-content: center;
    align-items: center;

    width: var(--ni-24);
    height: var(--ni-24);

    :global(img) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  :global(.trakt-action-button) {
    @include for-mouse() {
      &:hover {
        .trakt-reaction-emoji-container {
          .animated {
            display: flex;
          }

          .static {
            display: none;
          }
        }
      }
    }
  }
</style>
