<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Observable } from "rxjs";

  type SpoilerBlurProps = {
    isSpoilerHidden: Observable<boolean>;
    focusable?: boolean;
  } & ChildrenProps;

  const {
    children,
    isSpoilerHidden,
    focusable = true,
  }: SpoilerBlurProps = $props();

  const { track } = useTrack(AnalyticsEvent.SpoilerReveal);

  let isRevealed = $state(false);
  const isHidden = $derived($isSpoilerHidden && !isRevealed);
  const isButton = $derived(isHidden && focusable);

  const reveal = (event: Event) => {
    if (!isHidden) return;

    event.preventDefault();
    isRevealed = true;
    track({ type: "show" });
  };

  const revealOnKey = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    reveal(event);
  };
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<trakt-spoiler-blur
  class:trakt-spoiler={isHidden}
  onclick={reveal}
  role={isButton ? "button" : undefined}
  tabindex={isButton ? 0 : undefined}
  aria-label={isButton ? m.button_label_reveal_spoiler() : undefined}
  onkeydown={isButton ? revealOnKey : undefined}
>
  {@render children()}
</trakt-spoiler-blur>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-spoiler-blur {
    display: inline-flex;
    transition: var(--transition-increment) ease-in-out;
    transition-property: filter;

    &.trakt-spoiler {
      @include spoiler-blur();
      cursor: pointer;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }
</style>
