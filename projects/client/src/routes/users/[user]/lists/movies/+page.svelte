<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import { page } from "$app/state";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";

  const status = $derived.by(() => {
    switch (page.url.searchParams.get("status")) {
      case "unreleased":
        return "unreleased";
      default:
        return "released";
    }
  });

  const pageTitle = $derived.by(() => {
    switch (status) {
      case "unreleased":
        return m.page_title_coming_soon();
      default:
        return m.page_title_available_now();
    }
  });

  const title = $derived.by(() => {
    switch (status) {
      case "unreleased":
        return m.list_title_coming_soon();
      default:
        return m.list_title_available_now();
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
