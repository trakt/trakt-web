<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AppStoreBadge from "../assets/AppStoreBadge.svelte";
  import GooglePlayBadge from "../assets/GooglePlayBadge.svelte";
</script>

<div class="trakt-apps">
  <div class="trakt-apps-header">
    <h4>{m.header_get_trakt_app()}</h4>
    <p>{m.text_trakt_apps_description()}</p>
  </div>
  <RenderFor audience="public" device={["mobile", "tablet-sm"]}>
    <div class="trakt-apps-links">
      <Link href={UrlBuilder.app.ios()} target="_blank">
        <AppStoreBadge />
      </Link>
      <Link href={UrlBuilder.app.android()} target="_blank">
        <GooglePlayBadge />
      </Link>
    </div>
  </RenderFor>
</div>

<style>
  .trakt-apps {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    position: relative;
  }

  .trakt-apps-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    align-items: center;

    padding: 0 var(--ni-24);
    text-align: center;

    h4 {
      font-size: var(--ni-32);
      font-weight: 700;

      text-transform: uppercase;
    }
  }

  .trakt-apps-links {
    display: flex;
    align-items: center;
    justify-content: center;

    gap: var(--gap-xs);

    :global(svg) {
      height: var(--ni-56);
      width: auto;
    }
  }
</style>
