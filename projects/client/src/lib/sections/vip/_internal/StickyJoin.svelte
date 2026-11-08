<script lang="ts">
  import ThreadRing from "$lib/components/badge/ThreadRing.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { onMount } from "svelte";
  import { SvelteSet } from "svelte/reactivity";
  import yodaUrl from "./icons/yoda.png";

  const {
    revealAfter,
    hideWhileVisible,
  }: {
    revealAfter: string;
    hideWhileVisible: ReadonlyArray<string>;
  } = $props();

  let isVisible = $state(false);

  onMount(() => {
    const anchor = document.querySelector(revealAfter);
    if (!anchor) return;

    const blockers = hideWhileVisible
      .map((selector) => document.querySelector(selector))
      .filter((element): element is Element => element != null);

    const visibleBlockers = new SvelteSet<Element>();
    let isAnchorPassed = false;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === anchor) {
          isAnchorPassed =
            !entry.isIntersecting && entry.boundingClientRect.top < 0;
          continue;
        }

        if (entry.isIntersecting) visibleBlockers.add(entry.target);
        else visibleBlockers.delete(entry.target);
      }

      isVisible = isAnchorPassed && visibleBlockers.size === 0;
    });

    [anchor, ...blockers].forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  });
</script>

<div
  class="trakt-vip-sticky-join"
  class:is-visible={isVisible}
  inert={!isVisible}
>
  <ThreadRing />

  <div class="sticky-join-label">
    <img src={yodaUrl} alt="" width="33" height="33" />
    <span>{m.text_vip_make_it_official()}</span>
  </div>

  <Button
    href="#vip-plans"
    size="small"
    label={m.button_text_vip_compare_plans()}
  >
    {m.button_text_vip_compare_plans()}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-sticky-join {
    display: none;

    @include for-mobile {
      position: fixed;
      inset-inline: var(--ni-12);
      bottom: calc(var(--mobile-navbar-height) + var(--gap-s));
      z-index: var(--layer-overlay);

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);

      box-sizing: border-box;
      min-height: var(--vip-sticky-join-height);
      padding: var(--ni-8) var(--ni-8) var(--ni-8) var(--ni-12);

      border-radius: var(--border-radius-pill);
      background-color: color-mix(
        in srgb,
        var(--color-background-navbar-base) 80%,
        transparent
      );
      backdrop-filter: blur(var(--ni-18));
      box-shadow: var(--shadow-raised);

      translate: 0 calc(100% + var(--mobile-navbar-height));
      opacity: 0;
      pointer-events: none;

      transition:
        translate var(--transition-spring-duration)
          var(--transition-spring-ease),
        opacity var(--transition-duration-short) ease-out;

      &.is-visible {
        translate: 0 0;
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  .sticky-join-label {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    min-width: 0;

    span {
      color: var(--color-text-primary);
      font-size: var(--font-size-text-small);
    }
  }
</style>
