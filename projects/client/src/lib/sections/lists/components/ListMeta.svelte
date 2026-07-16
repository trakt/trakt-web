<script lang="ts">
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import LikeListButton from "$lib/sections/lists/user/LikeListButton.svelte";
  import { assertDefined } from "$lib/utils/assert/assertDefined.ts";
  import { toLocaleNumber } from "$lib/utils/formatting/number/toLocaleNumber.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { ListMetaProps } from "./_internal/ListMetaProps.ts";

  const {
    list,
    itemCount,
    isPartialCount = false,
    showOwner = true,
    showLike = true,
    metaText,
    countUrl,
    onCountClick,
  }: ListMetaProps = $props();

  const displayCount = $derived.by(() => {
    const value = itemCount ?? list?.count;

    if (value == null) {
      return undefined;
    }

    return `${toLocaleNumber(value, languageTag())}${
      isPartialCount ? "+" : ""
    }`;
  });

  const hasProfileLink = $derived(
    Boolean(list?.user?.slug) && !list?.user?.isDeleted,
  );
</script>

{#snippet owner(ownedList: MediaListSummary)}
  <div class="meta-item owner-item">
    <ProfileIcon />
    {#if hasProfileLink}
      <p class="small ellipsis">{toDisplayableName(ownedList.user)}</p>
    {:else}
      <UserProfileLink user={ownedList.user} />
    {/if}
  </div>
{/snippet}

{#snippet count(countLabel: string)}
  <div
    class="meta-item count-item"
    title={m.text_list_item_count({ count: countLabel })}
  >
    <MediaIcon />
    <p class="small">{countLabel}</p>
  </div>
{/snippet}

<div class="trakt-list-meta">
  {#if metaText}
    <p class="bold meta-text">{metaText}</p>
  {/if}

  {#if showOwner && list}
    {#if hasProfileLink}
      <Link href={UrlBuilder.profile.user(assertDefined(list.user.slug))}>
        {@render owner(list)}
      </Link>
    {:else}
      {@render owner(list)}
    {/if}
  {/if}

  {#if displayCount != null}
    {#if countUrl}
      <Link href={countUrl} onclick={onCountClick}>
        {@render count(displayCount)}
      </Link>
    {:else}
      {@render count(displayCount)}
    {/if}
  {/if}

  {#if showLike && list}
    <LikeListButton {list} style="text" />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-meta {
    display: flex;
    align-items: center;
    min-width: 0;

    gap: var(--gap-s);

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

  .meta-text {
    flex-shrink: 0;

    color: var(--list-meta-info-color);
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
