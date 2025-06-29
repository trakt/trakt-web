<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import { page } from "$app/state";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";

  const status = $derived.by(() => {
    switch (page.url.searchParams.get("status")) {
      case "released":
        return "released";
      case "unreleased":
        return "unreleased";
      default:
        return "all";
    }
  });

  const pageTitle = $derived.by(() => {
    switch (status) {
      case "released":
        return m.page_title_available_now();
      case "unreleased":
        return m.page_title_coming_soon();
      default:
        return m.page_title_watchlist_movies();
    }
  });

  const title = $derived.by(() => {
    switch (status) {
      case "released":
        return m.list_title_available_now();
      case "unreleased":
        return m.list_title_coming_soon();
      default:
        return m.your_watchlist_movies();
    }
  });
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={pageTitle}
>
  <TraktPageCoverSetter />

  <WatchlistPaginatedList {status} {title} type="movie" />
</TraktPage>
