<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { SmartListTemplate } from "$lib/requests/models/SmartListTemplate.ts";
  import ListSummaryCard from "$lib/sections/lists/components/ListSummaryCard.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import { getSmartListTemplateCopy } from "../getSmartListTemplateCopy.ts";
  import { toSmartListSourceLabel } from "../../toSmartListSourceLabel.ts";
  import { toSmartListTemplateChips } from "../toSmartListTemplateChips.ts";
  import { toSmartListTemplateUrl } from "../toSmartListTemplateUrl.ts";
  import SmartListTemplateChips from "./SmartListTemplateChips.svelte";
  import { toSmartListMediaTypeLabel } from "../../toSmartListMediaTypeLabel.ts";
  import { useSmartListTemplatePreview } from "./useSmartListTemplatePreview.ts";

  const POSTER_SLOTS = 3;

  const { template }: { template: SmartListTemplate } = $props();

  const preview = useSmartListTemplatePreview(fromRune(() => template));
  const copy = $derived(getSmartListTemplateCopy(template.id));
  const name = $derived(copy?.name() ?? "");
  const chips = $derived(
    copy
      ? toSmartListTemplateChips({ ...template, showcase: copy.showcase })
      : [],
  );
  const posterSlots = $derived(
    Array.from({ length: POSTER_SLOTS }, (_, index) => $preview.posters.at(index)),
  );
  const href = $derived(toSmartListTemplateUrl({ template, name }));
  const source = $derived(
    `${toSmartListSourceLabel(template.source)} · ${toSmartListMediaTypeLabel(template.mediaType)}`,
  );
</script>

{#if copy}
  <div class="trakt-smart-list-template-card">
    <ListSummaryCard>
      <GlobalParameterEscaper enabled>
        <Link {href} color="inherit">
          <div class="template-content">
            <div class="template-posters">
              {#each posterSlots as poster, index (`${template.id}_poster_${index}`)}
                <div class="template-poster" style="--poster-index: {index}">
                  {#if poster}
                    <CrossOriginImage
                      src={poster}
                      alt={m.image_alt_list_preview_poster({ title: name })}
                    />
                  {/if}
                </div>
              {/each}
            </div>

            <div class="template-text">
              <div class="template-badges">
                <span class="template-badge"
                  >{m.tag_text_smart_list_template_official()}</span
                >
                {#if template.personal}
                  <span class="template-badge is-personal"
                    >{m.tag_text_smart_list_template_personal()}</span
                  >
                {/if}
              </div>

              <p class="template-name bold">{name}</p>
              <p class="template-pitch small">{copy.pitch()}</p>

              {#key chips.join()}
                <SmartListTemplateChips {chips} />
              {/key}

              <div class="template-footer small">
                <span class="ellipsis">{source}</span>
                {#if $preview.total != null}
                  <span class="template-total">
                    {m.text_smart_list_template_total({
                      count: toHumanCount($preview.total, languageTag()),
                    })}
                  </span>
                {/if}
              </div>
            </div>
          </div>
        </Link>
      </GlobalParameterEscaper>
    </ListSummaryCard>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-template-card {
    --height-list-card: var(--height-smart-list-template-card);

    :global(.trakt-link) {
      display: block;
      height: 100%;
      text-decoration: none;
    }
  }

  .template-content {
    --template-poster-width: var(--ni-80);

    height: 100%;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    @include for-mobile {
      --template-poster-width: var(--ni-66);
    }
  }

  .template-posters {
    position: relative;

    flex: 0 0 40%;
    align-self: stretch;
  }

  .template-poster {
    position: absolute;
    top: 50%;
    inset-inline-start: calc(
      (100% - var(--template-poster-width)) / 2 * var(--poster-index)
    );

    width: var(--template-poster-width);
    aspect-ratio: 2 / 3;
    translate: 0 -50%;
    rotate: calc((var(--poster-index) - 1) * 6deg);
    z-index: var(--poster-index);

    box-shadow: var(--shadow-floating);
    border-radius: var(--border-radius-m);
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
      object-position: top;
    }
  }

  .template-text {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    justify-content: center;
  }

  .template-badges {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .template-badge {
    height: var(--ni-16);
    padding-inline: var(--gap-xs);
    border-radius: var(--border-radius-s);

    background-color: color-mix(
      in srgb,
      var(--color-foreground) 8%,
      transparent
    );
    color: var(--color-text-secondary);

    font-size: var(--font-size-tag);
    font-weight: 600;
    line-height: var(--ni-16);

    &.is-personal {
      background-color: var(--color-filter-chip-background);
      color: var(--color-text-emphasis);
    }
  }

  .template-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    color: var(--color-text-primary);
    font-size: var(--ni-16);
    line-height: var(--ni-20);
  }

  .template-pitch {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    color: var(--color-text-primary);
    line-height: var(--ni-16);
  }

  .template-footer {
    color: var(--color-text-secondary);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    min-width: 0;
  }

  .template-total {
    flex: none;
  }
</style>
