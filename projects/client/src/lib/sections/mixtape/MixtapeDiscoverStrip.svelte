<script lang="ts">
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import MusicNoteIcon from "$lib/components/icons/MusicNoteIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { type }: { type: MediaType } = $props();
</script>

<RenderFor audience="authenticated">
  <RenderForFeature flag={FeatureFlag.Mixtape} audience="director">
    {#snippet enabled()}
      <div class="trakt-mixtape-discover-strip">
        <Link href={UrlBuilder.mixtape({ type, source: "discover" })}>
          <div class="strip-content">
            <MusicNoteIcon />
            <span class="bold no-wrap">{m.button_text_make_mixtape()}</span>
            <span class="small secondary ellipsis strip-description">
              {m.text_mixtape_strip_description()}
            </span>
            <span class="strip-arrow trakt-icon-directional">
              <ArrowRightIcon />
            </span>
          </div>
        </Link>
      </div>
    {/snippet}
  </RenderForFeature>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-discover-strip {
    padding-inline: var(--layout-distance-side);

    .strip-content {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      min-height: var(--ni-56);
      padding-inline: var(--gap-m);

      border-radius: var(--border-radius-l);
      background: var(--color-card-background);
      box-shadow: var(--shadow-floating);
    }

    .strip-description {
      display: block;
      min-width: 0;
      flex: 1;

      @include for-mobile {
        display: none;
      }
    }

    .strip-arrow {
      margin-inline-start: auto;
      display: flex;
    }
  }
</style>
