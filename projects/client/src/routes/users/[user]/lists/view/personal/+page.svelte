<script lang="ts">
  import type { SearchFieldVariant } from "$lib/components/form/models/SearchFieldVariant.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListSearchButton from "$lib/sections/lists/user/ListSearchButton.svelte";
  import ListSearchInput from "$lib/sections/lists/user/ListSearchInput.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import PersonalListsPaginated from "$lib/sections/lists/user/PersonalListsPaginated.svelte";
  import { useUserListsSearch } from "$lib/sections/lists/user/useUserListsSearch.svelte.ts";
  import { useUserListsSorting } from "$lib/sections/lists/user/useUserListsSorting.ts";
  import UserListsActions from "$lib/sections/lists/user/UserListsActions.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current } = useDiscover();
  const { isMe } = $derived(useIsMe(params.user));
  const { current: sorting, options, urlBuilder } =
    $derived(useUserListsSorting({ slug: params.user }));
  const search = useUserListsSearch();

  // Desktop hosts the search field inside the navbar's content toggle, the
  // same panel the search page uses. Smaller screens hide that toggle, so
  // they get the standalone field above the lists instead.
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const hasSearchExtension = $derived(search.isOpen && $isDesktop);
</script>

{#snippet listActions()}
  {#if $isMe}
    <UserListsActions
      slug={params.user}
      title={m.list_title_personal_lists()}
    />
  {/if}
{/snippet}

{#snippet listSearch(variant: SearchFieldVariant)}
  <ListSearchInput
    {variant}
    value={search.term}
    onInput={(value) => (search.term = value)}
    onClose={search.close}
  />
{/snippet}

{#snippet listSearchExtension()}
  {@render listSearch("embedded")}
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter contentToggle="discover"
    contentToggleExtension={hasSearchExtension ? listSearchExtension : null}
    hasFilters
    header={{
      title: m.list_title_personal_lists(),
      metaInfo: $current.text(),
      actions: listActions,
    }}
  >
    {#snippet headerActions()}
      <ListSearchButton isActive={search.isOpen} onclick={search.toggle} />
      <ListSortActions
        {options}
        urlBuilder={(sortParams) =>
          urlBuilder({ ...sortParams, terms: search.filter })}
        current={$sorting}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  {#if search.isOpen && !$isDesktop}
    {@render listSearch("default")}
  {/if}

  <div
    class="trakt-personal-lists"
    class:has-search-extension={hasSearchExtension}
  >
    <PersonalListsPaginated
      type="personal"
      slug={params.user}
      sortBy={$sorting.sorting.value}
      sortHow={$sorting.sortHow}
      searchTerm={search.filter}
    />
  </div>
</TraktPage>

<style>
  .trakt-personal-lists {
    display: flex;
    flex-direction: column;
    gap: var(--content-gap);

    transition: padding-top var(--transition-increment) ease-in-out;

    /* The expanded toggle overlaps the page, mirror the search page clearance. */
    &.has-search-extension {
      padding-top: calc(
        var(--segmented-select-extension-height) + var(--gap-m)
      );
    }
  }
</style>
