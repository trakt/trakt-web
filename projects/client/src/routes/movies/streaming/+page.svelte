<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import StreamingPaginatedList from "$lib/sections/lists/streaming/StreamingPaginatedList.svelte";

  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.streaming_movie_picks()}
>
  <TraktPageCoverSetter />

  <StreamingPaginatedList title={m.streaming_movie_picks()} type="movie" />
</TraktPage>
