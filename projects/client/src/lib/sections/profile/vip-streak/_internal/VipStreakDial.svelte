<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion, Tween } from "svelte/motion";

  const { years }: { years: number } = $props();

  const count = Tween.of(() => years, {
    duration: prefersReducedMotion.current ? 0 : 900,
    easing: cubicOut,
  });

  const caption = $derived(
    years === 1
      ? m.text_vip_streak_caption_one()
      : m.text_vip_streak_caption_other(),
  );
</script>

<div class="trakt-vip-streak-dial">
  <span class="dial-count" aria-hidden="true">{Math.round(count.current)}</span>
  <span class="visually-hidden">{years}</span>
  <span class="dial-caption secondary">{caption}</span>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-streak-dial {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-micro);

    font-variant-numeric: tabular-nums;
  }

  .dial-count {
    font-size: var(--ni-64);
    font-weight: 800;
    line-height: 1;
  }

  .visually-hidden {
    @include visually-hidden;
  }
</style>
