<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import PersonalListsPaginated from "$lib/sections/lists/user/PersonalListsPaginated.svelte";
  import { useUserListsSorting } from "$lib/sections/lists/user/useUserListsSorting.ts";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current } = useDiscover();
  const {
    current: sorting,
    options,
    urlBuilder,
    directionFor,
  } = $derived(
    useUserListsSorting({ slug: params.user, type: "shared" }),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    contentToggle="discover"
    hasFilters
    header={{
      title: m.list_title_shared_lists(),
      metaInfo: $current.text(),
    }}
  >
    {#snippet headerActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        {directionFor}
        current={$sorting}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <PersonalListsPaginated
    type="shared"
    slug={params.user}
    sortBy={$sorting.sorting.value}
    sortHow={$sorting.sortHow}
  />
</TraktPage>
