<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListsCount from "$lib/sections/lists/components/ListsCount.svelte";
  import PersonalListsPaginated from "$lib/sections/lists/user/PersonalListsPaginated.svelte";
  import { useListsCount } from "$lib/sections/lists/user/useListsCount.ts";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { DEFAULT_LISTS_DRILL_SIZE } from "$lib/utils/constants.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current } = useDiscover();

  const { count: listsCount } = $derived(
    useListsCount({
      type: "collaboration",
      slug: params.user,
      limit: DEFAULT_LISTS_DRILL_SIZE,
    }),
  );
</script>

{#snippet listsMetaInfo()}
  <ListsCount count={$listsCount} metaText={$current.text()} />
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
      title: m.list_title_collaborative_lists(),
      metaInfo: listsMetaInfo,
    }}
  />

  <PersonalListsPaginated type="collaboration" slug={params.user} />
</TraktPage>
