<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import WatchlistList from "$lib/sections/lists/watchlist/WatchlistList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.navbar_link_watchlist()}
>
  <CoverImageSetter src={current().cover.url} type="main" />

  <WatchlistList
    title={m.watchlist_movies()}
    emptyMessage={m.watchlist_movies_empty()}
    type="movie"
  />

  <WatchlistList
    title={m.watchlist_shows()}
    emptyMessage={m.watchlist_shows_empty()}
    type="show"
  />
</TraktPage>
