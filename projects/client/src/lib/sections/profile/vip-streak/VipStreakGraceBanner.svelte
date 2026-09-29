<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { years, daysLeft }: { years: number; daysLeft: number } = $props();

  const title = $derived(
    daysLeft === 1
      ? m.text_vip_grace_ends_one({ years: String(years) })
      : m.text_vip_grace_ends_other({
        years: String(years),
        days: String(daysLeft),
      }),
  );
</script>

<div class="trakt-vip-streak-grace-banner" role="status">
  <span class="grace-icon" aria-hidden="true"><ClockIcon /></span>
  <div class="grace-text">
    <p class="bold">{title}</p>
    <p class="secondary">{m.text_vip_grace_body()}</p>
  </div>
  <Button
    href={UrlBuilder.renewVip()}
    size="small"
    color="purple"
    label={m.button_label_renew_vip()}
  >
    {m.button_text_renew_vip()}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin grace-card {
    @include vip-glow-card;

    justify-content: flex-start;
    padding: var(--ni-16);
    border-radius: var(--border-radius-l);

    .grace-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      width: var(--ni-40);
      height: var(--ni-40);
      border-radius: 50%;
      color: var(--color-glow-vip-badge-vip);
      background: color-mix(
        in srgb,
        var(--color-glow-vip-badge-vip) 16%,
        transparent
      );

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }
  }

  .trakt-vip-streak-grace-banner {
    box-sizing: border-box;
    width: calc(100% - 2 * var(--layout-distance-side));
    max-width: var(--ni-1280);
    margin: 0 var(--layout-distance-side);
    align-self: flex-start;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    padding: var(--gap-s) var(--gap-m);
    border-radius: var(--border-radius-m);
    background: color-mix(
      in srgb,
      var(--color-glow-vip-badge-vip) 18%,
      transparent
    );
    border: var(--border-thickness-xs) solid
      color-mix(in srgb, var(--color-glow-vip-badge-vip) 45%, transparent);

    animation: grace-banner-in 320ms ease-out both;

    @include for-tablet-lg {
      @include grace-card;
    }

    @include for-desktop {
      @include grace-card;
    }

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .grace-icon {
    display: none;
  }

  .grace-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  @keyframes grace-banner-in {
    from {
      opacity: 0;
      transform: translateY(calc(-1 * var(--ni-8)));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-vip-streak-grace-banner {
      animation: none;
    }
  }
</style>
