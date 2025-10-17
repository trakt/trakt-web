<script>
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import StartWatchingPaginatedList from "$lib/sections/lists/start-watching/StartWatchingPaginatedList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title="Start Watching"
>
  <TraktPageCoverSetter />

  <StartWatchingPaginatedList />
</TraktPage>
