<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { time } from "$lib/utils/timing/time";
  import { onMount } from "svelte";
  import { toReactionEmojiUrl } from "./toReactionEmojiUrl.ts";


  const {
    code,
    label,
    animation = "none",
    index = 0,
  }: {
    code: string;
    label: string;
    index?: number;
    animation?: "initial" | "infinite" | "none";
  } = $props();


  const hasInitialAnimation = writable(false);

  let animatedCode = $state<string | null>(null);
  const isAnimationReady = $derived(animatedCode === code);

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

<div
  class="trakt-reaction-emoji-container"
  class:is-animated={hasAnimation}
  class:is-animation-ready={isAnimationReady}
>
  <picture class="trakt-reaction-emoji animated">
    <source srcset={toReactionEmojiUrl(code, "512.webp")} type="image/webp" />
    <CrossOriginImage
      loading="lazy"
      animate={false}
      src={toReactionEmojiUrl(code, "512.gif")}
      alt={label}
      onload={() => (animatedCode = code)}
    />
  </picture>

  <picture class="trakt-reaction-emoji static">
    <CrossOriginImage
      loading="eager"
      src={toReactionEmojiUrl(code, "emoji.svg")}
      alt={label}
    />
  </picture>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reaction-emoji-container {
    display: grid;

    .animated {
      display: none;
    }

    &.is-animated {
      .animated {
        display: flex;
      }
    }

    &.is-animated.is-animation-ready {
      .static {
        display: none;
      }
    }
  }

  .trakt-reaction-emoji {
    grid-area: 1 / 1;

    display: flex;
    justify-content: center;
    align-items: center;

    width: var(--reaction-emoji-box, var(--ni-24));
    height: var(--reaction-emoji-box, var(--ni-24));

    :global(img) {
      width: var(--reaction-emoji-size, var(--ni-18));
      height: var(--reaction-emoji-size, var(--ni-18));
    }
  }

  :global(.trakt-action-button) {
    @include for-mouse() {
      &:hover {
        .trakt-reaction-emoji-container {
          .animated {
            display: flex;
          }

          &.is-animation-ready .static {
            display: none;
          }
        }
      }
    }
  }
</style>
