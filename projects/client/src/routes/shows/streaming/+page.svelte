<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import StreamingPaginatedList from "$lib/sections/lists/streaming/StreamingPaginatedList.svelte";

  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.streaming_show_picks()}
>
  <TraktPageCoverSetter />

  <StreamingPaginatedList title={m.streaming_show_picks()} type="show" />
</TraktPage>
