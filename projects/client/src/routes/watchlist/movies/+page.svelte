<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import { page } from "$app/state";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";

  const status = $derived.by(() => {
    switch (page.url.searchParams.get("status")) {
      case "out-now":
        return "out-now";
      case "coming-soon":
        return "coming-soon";
      default:
        return "all";
    }
  });

  const title = $derived.by(() => {
    switch (status) {
      case "out-now":
        return m.out_now_title();
      case "coming-soon":
        return m.coming_soon_title();
      default:
        return m.your_watchlist_movies();
    }
  });
</script>

<TraktPage audience="authenticated" image={DEFAULT_SHARE_MOVIE_COVER} {title}>
  <TraktPageCoverSetter />

  <WatchlistPaginatedList {status} {title} type="movie" />
</TraktPage>
