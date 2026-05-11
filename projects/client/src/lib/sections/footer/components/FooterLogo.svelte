<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const currentYear = new Date().getFullYear();
  const copyright = `© 2010-${currentYear} trakt, inc. ${m.text_copyright_notice()}`;
</script>

<div class="trakt-footer-logo">
  <div class="trakt-logo">
    <Logo />
  </div>
  <div class="taglines">
    <p class="tagline-primary bold">DISCOVER.TRACK.SHARE</p>
    <p class="tagline-secondary">{copyright} {m.text_copyright_crafted_by()}</p>
  </div>
</div>

<style lang="scss">
  .trakt-footer-logo {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .trakt-logo {
    height: 38px; /* Scaled down 20% from 48px */
    width: 135px; /* Maintains the 170x48 aspect ratio (38 * 3.5416) */
    display: flex;
    margin-bottom: var(--ni-4);
    
    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .taglines {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .tagline-primary {
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--color-text-primary);
    margin: 0;
    width: 135px; /* Matches exact width of scaled down logo */
    white-space: nowrap;
  }

  .tagline-secondary {
    font-size: var(--ni-11);
    letter-spacing: 0.06em;
    color: var(--color-text-secondary);
    margin: 0;
    white-space: nowrap;
  }
</style>
