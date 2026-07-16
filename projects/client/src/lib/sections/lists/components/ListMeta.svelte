<script lang="ts">
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";
  import type { ListMetaProps } from "./_internal/ListMetaProps.ts";

  const {
    list,
    itemCount,
    type,
    showOwner = true,
    metaText,
    countUrl,
    onCountClick,
  }: ListMetaProps = $props();

  const CountIcon = $derived.by(() => {
    switch (type) {
      case "movie":
        return MovieIcon;
      case "show":
        return ShowIcon;
      default:
        return MediaIcon;
    }
  });

  const displayCount = $derived.by(() => {
    const value = itemCount ?? list?.count;

    if (value == null) {
      return undefined;
    }

    return toGroupedNumber(value, languageTag());
  });

</script>

{#snippet owner(ownedList: MediaListSummary)}
  <div class="meta-item owner-item">
    <p class="secondary">{m.text_by()}</p>
    <UserProfileLink user={ownedList.user} />
  </div>
{/snippet}

{#snippet count(countLabel: string)}
  <div
    class="meta-item count-item"
    role="img"
    aria-label={m.label_list_item_count({ count: countLabel })}
    title={m.label_list_item_count({ count: countLabel })}
  >
    <CountIcon />
    <p class="small">{countLabel}</p>
  </div>
{/snippet}

<div class="trakt-list-meta">
  {#if metaText}
    <ListMetaInfo text={metaText} />
  {/if}

  {#if showOwner && list}
    {@render owner(list)}
  {/if}

  {#if displayCount != null}
    <RenderForFeature flag={FeatureFlag.ListCounts}>
      {#snippet enabled()}
        {#if countUrl}
          <Link href={countUrl} onclick={onCountClick}>
            {@render count(displayCount)}
          </Link>
        {:else}
          {@render count(displayCount)}
        {/if}
      {/snippet}
    </RenderForFeature>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-meta {
    display: flex;
    align-items: center;
    min-width: 0;

    gap: var(--gap-s);

    > :global(p) {
      flex-shrink: 0;
    }

    > :global(.trakt-link) {
      min-width: 0;
      text-decoration: none;
    }

    > :global(.trakt-link:focus-visible .meta-item) {
      color: var(--color-link-active);
    }

    @include for-mouse {
      > :global(.trakt-link:hover .meta-item) {
        color: var(--color-link-active);
      }
    }
  }

  .meta-item {
    display: flex;
    align-items: center;

    gap: var(--gap-xxs);

    color: var(--color-text-secondary);

    transition: color var(--transition-increment) ease-in-out;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
      flex-shrink: 0;
    }

    :global(p) {
      color: inherit;
    }
  }

  .owner-item {
    min-width: 0;
  }

  .count-item {
    flex-shrink: 0;
  }
</style>
