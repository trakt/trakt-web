<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import AppStoreBadge from "../assets/AppStoreBadge.svelte";
  import GooglePlayBadge from "../assets/GooglePlayBadge.svelte";
</script>

<section class="trakt-landing-apps">
  <div class="apps-copy">
    <h2 class="capitalize">{m.header_get_trakt_app()}</h2>
    <p class="capitalize">{m.text_trakt_apps_description()}</p>
  </div>
  <div class="apps-links">
    <Link href={UrlBuilder.app.ios()} target="_blank">
      <AppStoreBadge />
    </Link>
    <Link href={UrlBuilder.app.android()} target="_blank">
      <GooglePlayBadge />
    </Link>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing-apps {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xl);

    margin: var(--ni-96) var(--ni-80);
    padding: var(--ni-56);

    border: var(--ni-1) solid var(--landing-color-border);
    border-radius: var(--ni-28);

    background:
      radial-gradient(
        60% 120% at calc(50% + 50% * var(--rtl-sign)) 100%,
        color-mix(in srgb, var(--purple-500) 35%, transparent),
        transparent 70%
      ),
      var(--shade-930);

    @include for-tablet-lg-and-below {
      margin: var(--ni-72) var(--ni-40);
      padding: var(--ni-40);
    }

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;

      margin: var(--ni-56) var(--ni-20);
      padding: var(--ni-28) var(--ni-24);
      border-radius: var(--ni-22);
    }
  }

  .apps-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    h2 {
      font-size: var(--ni-36);
      font-weight: 900;
      letter-spacing: -0.03em;
    }

    p {
      max-width: var(--ni-480);

      font-size: var(--ni-16);
      color: var(--landing-color-muted);
    }

    @include for-tablet-sm-and-below {
      h2 {
        font-size: var(--ni-28);
      }
    }
  }

  .apps-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-s);

    :global(svg) {
      display: block;
      height: var(--ni-52);
      width: auto;
    }
  }
</style>
