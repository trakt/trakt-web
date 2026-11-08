<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import ThreadRing from "./ThreadRing.svelte";
</script>

<span class="trakt-vip-upsell-badge">
  <ThreadRing />

  <span class="badge-label uppercase">{m.badge_text_get_vip()}</span>
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-upsell-badge {
    --badge-label-color: var(--color-text-primary);
    --thread-ring-weight: var(--ni-1);
    --thread-ring-intensity: 1;
    --thread-ring-boost: paused;

    @include for-mouse {
      :global(.trakt-link:hover) &,
      :global(.trakt-link:focus-visible) & {
        --badge-label-color: var(--color-vip-thread-label-hover);
        --thread-ring-weight: var(--ni-2);
        --thread-ring-intensity: 1.4;
        --thread-ring-boost: running;
      }
    }

    position: relative;
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: var(--ni-40);
    padding-inline: var(--ni-20);

    border-radius: var(--border-radius-pill);
    background: transparent;

    .badge-label {
      position: relative;

      color: var(--badge-label-color);
      font-size: var(--font-size-text-small);
      font-weight: 700;
      letter-spacing: 0.14em;
      white-space: nowrap;

      margin-inline-end: -0.14em;

      transition: color var(--transition-increment) ease-in-out;
    }
  }
</style>
