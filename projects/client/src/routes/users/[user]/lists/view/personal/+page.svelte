<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListSearchButton from "$lib/sections/lists/user/ListSearchButton.svelte";
  import ListSearchInput from "$lib/sections/lists/user/ListSearchInput.svelte";
  import ListSearchLayout from "$lib/sections/lists/user/ListSearchLayout.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import type { ListSearchCopy } from "$lib/sections/lists/user/models/ListSearchCopy.ts";
  import PersonalListsPaginated from "$lib/sections/lists/user/PersonalListsPaginated.svelte";
  import { useListSearch } from "$lib/sections/lists/user/useListSearch.svelte.ts";
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
  const search = useListSearch();
  const searchCopy: ListSearchCopy = {
    toggle: m.button_label_search_lists(),
    label: m.input_label_search_lists(),
    placeholder: m.input_placeholder_search_lists(),
  };

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

{#snippet listSearchExtension()}
  <ListSearchInput {search} copy={searchCopy} variant="embedded" />
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
      <ListSearchButton
        copy={searchCopy}
        isActive={search.isOpen}
        onclick={search.toggle}
      />
      <ListSortActions
        {options}
        urlBuilder={(sortParams) =>
          urlBuilder({ ...sortParams, terms: search.filter })}
        current={$sorting}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <ListSearchLayout {search} copy={searchCopy} isEmbedded={$isDesktop}>
    <PersonalListsPaginated
      type="personal"
      slug={params.user}
      sortBy={$sorting.sorting.value}
      sortHow={$sorting.sortHow}
      searchTerm={search.filter}
    />
  </ListSearchLayout>
</TraktPage>
