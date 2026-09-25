<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { time } from "$lib/utils/timing/time";
  import { onMount } from "svelte";

  /*
    ONE emoji renderer for every reaction surface in the app.

    It used to live inside the comment stack, reachable only from there - so
    anything else that wanted an emoji was going to grow its own, and the
    obvious shortcut is a bare unicode character in a span. That renders as
    whatever the viewer's OS happens to ship and never moves.

    This is the shipped comment behaviour, unchanged: Google's animated Noto
    emoji, a static SVG at rest and the animated frames on hover. Taxonomies
    stay with their own domains - this takes a `code` and knows nothing about
    which set it came from.
  */
  const EMOJI_BASE_URL = "https://fonts.gstatic.com/s/e/notoemoji/latest";

  const {
    code,
    label,
    animation = "none",
    index = 0,
  }: {
    code: string;
    label: string;
    /* Only read by the staggered intro; static callers can leave it off. */
    index?: number;
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

  /*
    Two hooks rather than one: the artwork and the box it sits in are set
    independently, because a chip wants a big emoji in a tight box while the
    picker wants a small one in a generous tap target. The defaults are the
    sizes the comment stack has always used, so nothing there moves.
  */
  .trakt-reaction-emoji {
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

          .static {
            display: none;
          }
        }
      }
    }
  }
</style>
