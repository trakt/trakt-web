<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CassetteIcon from "$lib/components/icons/CassetteIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { type }: { type: MediaType } = $props();
</script>

<RenderFor audience="authenticated">
  <div class="trakt-mixtape-discover-strip">
    <Link href={UrlBuilder.mixtape({ type, source: "discover" })}>
      <div class="strip-content">
        <span class="strip-icon"><CassetteIcon /></span>
        <span class="strip-text">
          <span class="bold">{m.button_text_make_mixtape()}</span>
          <span class="small secondary ellipsis">
            {m.text_mixtape_strip_description()}
          </span>
        </span>
        <span class="strip-arrow"><CaretRightIcon /></span>
      </div>
    </Link>
  </div>
</RenderFor>

<style lang="scss">
  .trakt-mixtape-discover-strip {
    padding-inline: var(--layout-distance-side);

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
    }

    .strip-content {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      padding: var(--gap-s);

      border-radius: var(--border-radius-l);
      background: var(--color-card-background);
      box-shadow: var(--shadow-floating);
      color: var(--color-text-primary);
    }

    .strip-icon {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--ni-44);
      height: var(--ni-44);

      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--purple-500) 14%, transparent);
      color: var(--color-text-emphasis);
    }

    .strip-text {
      display: flex;
      flex-direction: column;
      gap: var(--ni-2);
      flex: 1;
      min-width: 0;

      .ellipsis {
        display: block;
      }
    }

    .strip-arrow {
      flex: none;
      display: flex;
      color: var(--color-text-secondary);

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }
  }
</style>
