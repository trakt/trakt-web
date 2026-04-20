<script>
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import TrendingPaginatedList from "$lib/sections/lists/trending/TrendingPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";

  const { mode, current } = useDiscover();
</script>

{#snippet actions()}
  <ShareButton
    title={m.list_title_trending()}
    textFactory={({ title: name }) => m.text_share_top_list({ name })}
    source={{ id: "trending", type: $mode }}
  />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_trending_media()}
>
  <NavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_trending(),
      metaInfo: $current.text(),
      actions,
    }}
  />

  <TraktPageCoverSetter />

  <TrendingPaginatedList type={$mode} />
</TraktPage>
