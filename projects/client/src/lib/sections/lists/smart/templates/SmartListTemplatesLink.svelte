<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { SmartListTemplate } from "$lib/requests/models/SmartListTemplate.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const POSTER_SLOTS = 3;

  const { templates }: { templates: SmartListTemplate[] } = $props();

  const label = $derived(
    (templates.length === 1
      ? m.button_text_browse_smart_list_templates_one
      : m.button_text_browse_smart_list_templates_other)({
      count: toHumanCount(templates.length, languageTag()),
    }),
  );

  const posters = $derived(
    templates
      .map((template) => template.posters.at(0))
      .filter((poster): poster is string => Boolean(poster))
      .slice(0, POSTER_SLOTS),
  );
</script>

<div class="trakt-smart-list-templates-link">
  <Link href={UrlBuilder.lists.smart.templates()} color="inherit">
    <div class="templates-link-card">
      {#if posters.length > 0}
        <div class="templates-link-posters" aria-hidden="true">
          {#each posters as poster, index (`${poster}_${index}`)}
            <div class="templates-link-poster" style="--poster-index: {index}">
              <CrossOriginImage src={poster} alt="" />
            </div>
          {/each}
        </div>
      {/if}

      <p class="templates-link-label bold ellipsis">{label}</p>

      <div class="templates-link-caret">
        <CaretRightIcon />
      </div>
    </div>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-templates-link {
    --templates-link-poster-width: var(--ni-28);

    margin-inline: var(--layout-distance-side);

    :global(.trakt-link) {
      display: block;
      width: fit-content;
      max-width: 100%;
      text-decoration: none;
    }

    @include for-mobile {
      :global(.trakt-link) {
        width: auto;
      }
    }
  }

  .templates-link-card {
    min-width: 0;
    max-width: var(--width-list-card);
    padding: var(--gap-s) var(--gap-m);

    display: flex;
    align-items: center;
    gap: var(--gap-m);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    transition: box-shadow var(--transition-increment) ease-in-out;

    @include for-mobile {
      max-width: none;
    }

    @include for-mouse {
      &:hover {
        box-shadow: var(--shadow-floating);

        .templates-link-caret {
          color: var(--color-text-primary);
        }
      }
    }
  }

  .templates-link-posters {
    position: relative;

    flex: none;
    width: calc(var(--templates-link-poster-width) * 2);
    height: calc(var(--templates-link-poster-width) * 1.5);
  }

  .templates-link-poster {
    position: absolute;
    top: 0;
    inset-inline-start: calc(
      var(--templates-link-poster-width) / 2 * var(--poster-index)
    );

    width: var(--templates-link-poster-width);
    aspect-ratio: 2 / 3;
    rotate: calc((var(--poster-index) - 1) * 6deg);
    z-index: var(--poster-index);

    border-radius: var(--border-radius-xs);
    box-shadow: var(--shadow-base);
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 8%,
      var(--color-card-background)
    );
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .templates-link-label {
    flex: 1;
    min-width: 0;
  }

  .templates-link-caret {
    flex: none;

    display: flex;

    color: var(--color-text-secondary);
    transition: color var(--transition-increment) ease-in-out;
  }
</style>
