<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import RecentlyWatchedPaginatedList from "$lib/sections/lists/history/RecentlyWatchedPaginatedList.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { mode, current } = useDiscover();
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_history()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    header={{ title: m.list_title_history(), metaInfo: $current.text() }}
  />

  <RecentlyWatchedPaginatedList slug={params.slug} mode={$mode} />
</TraktPage>
