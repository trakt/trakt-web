<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
</script>

<div class="trakt-vip-upsell">
  <h1 class="bold">
    {m.text_vip_upsell_default()}
  </h1>
  <p>
    {m.text_vip_upsell_default_description()}
  </p>
  <GetVIPLink source="profile" />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-upsell {
    --upsell-border-radius: var(--border-radius-l);

    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-m);

    box-sizing: border-box;
    padding: var(--ni-24);

    border-radius: var(--upsell-border-radius);
    border: var(--ni-2) solid transparent;

    z-index: var(--layer-base);

    &::after {
      content: "";
      position: absolute;

      inset: calc(var(--ni-2) * -1);
      padding: var(--ni-2);

      border-radius: var(--upsell-border-radius);

      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-border) 80%, transparent) 0%,
        color-mix(in srgb, var(--color-border) 80%, transparent) 30%,
        color-mix(in srgb, var(--color-border) 10%, transparent) 40%,
        color-mix(in srgb, var(--color-border) 100%, transparent) 50%,
        color-mix(in srgb, var(--color-border) 10%, transparent) 60%,
        color-mix(in srgb, var(--color-border) 80%, transparent) 70%,
        color-mix(in srgb, var(--color-border) 80%, transparent) 100%
      );
      background-size: 300% 300%;
      animation: metallic-shine 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;

      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask-composite: exclude;
      pointer-events: none;
    }

    &::before {
      content: "";
      position: absolute;
      inset: 0;

      border-radius: var(--upsell-border-radius);

      background: var(--background-vip-drawer);
      backdrop-filter: blur(var(--ni-10));

      opacity: 0.3;
      z-index: var(--layer-background);
    }

    @include for-tablet-sm-and-below {
      &::before {
        opacity: 1;
        backdrop-filter: none;
      }
    }

    @include for-mobile {
      padding: var(--ni-16);
    }
  }

  @keyframes metallic-shine {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
</style>
