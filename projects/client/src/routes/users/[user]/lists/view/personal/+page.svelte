<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import PersonalListsPaginated from "$lib/sections/lists/user/PersonalListsPaginated.svelte";
  import { useUserListsSorting } from "$lib/sections/lists/user/useUserListsSorting.ts";
  import UserListsActions from "$lib/sections/lists/user/UserListsActions.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current } = useDiscover();
  const { isMe } = $derived(useIsMe(params.user));
  const { current: sorting, update, options, urlBuilder } =
    $derived(useUserListsSorting({ slug: params.user }));
</script>

{#snippet listActions()}
  {#if $isMe}
    <UserListsActions
      slug={params.user}
      title={m.list_title_personal_lists()}
    />
  {/if}
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_personal_lists(),
      metaInfo: $current.text(),
      actions: listActions,
    }}
  >
    {#snippet headerActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$sorting}
        onUpdate={update}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <PersonalListsPaginated
    type="personal"
    slug={params.user}
    sortBy={$sorting.sorting.value}
    sortHow={$sorting.sortHow}
  />
</TraktPage>
