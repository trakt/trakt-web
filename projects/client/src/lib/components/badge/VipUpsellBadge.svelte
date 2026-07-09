<script lang="ts">
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
</script>

<div class="trakt-vip-upsell-badge">
  <span class="upsell-sparkle" aria-hidden="true">
    <SparkleStarIcon />
  </span>
  <p class="uppercase">{m.badge_text_get_vip()}</p>
</div>

<style lang="scss">
  .trakt-vip-upsell-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    padding: var(--ni-8) var(--ni-12);
    height: var(--ni-28);
    box-sizing: border-box;
    border-radius: var(--border-radius-xl);

    // Inviting purple gradient + soft glow instead of the flat red - the upsell
    // should feel aspirational, not like a paywall.
    background: linear-gradient(
      135deg,
      var(--purple-400),
      var(--purple-600)
    );
    color: var(--color-foreground-vip-badge);
    box-shadow: 0 var(--ni-2) var(--ni-12)
      color-mix(in srgb, var(--purple-500) 45%, transparent);

    p {
      font-weight: 700;
      white-space: nowrap;
    }

    .upsell-sparkle {
      display: inline-flex;

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }
  }
</style>
