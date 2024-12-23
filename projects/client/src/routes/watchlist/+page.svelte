<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import WatchlistList from "$lib/sections/lists/WatchlistList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<RenderFor audience="authenticated">
  <TraktPage image={DEFAULT_SHARE_COVER} title={m.navbar_link_movies()}>
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
</RenderFor>
