<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { iffy } from "$lib/utils/function/iffy";
  import { onMount } from "svelte";

  const { filterMap } = useFilter();

  /* 
    We only capture the initial filterMap, since setting filters
    for smart lists will also emit.
  */
  const currentFilters = iffy(() => $filterMap);

  /* 
    On back-button navigation the URL could already be clean, so fall back to
    the filters we stored in the history state entry during onMount.
  */
  const capturedFilters =
    Object.keys(currentFilters).length > 0
      ? currentFilters
      : (page.state.preservedFilters ?? {});

  onMount(() => {
    const currentUrl = new URL(page.url);
    Object.keys(capturedFilters).forEach((key) =>
      currentUrl.searchParams.delete(key),
    );

    if (currentUrl.href === page.url.href) return;
    /*
      Store captured filters in the history state so that back-button
      navigation to this entry can restore them from page.state.
    */
    goto(currentUrl, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
      state: { preservedFilters: capturedFilters },
    });
  });

  beforeNavigate((nav) => {
    if (!nav.to || nav.to.route.id === nav.from?.route.id) return;

    const targetUrl = new URL(nav.to.url);
    Object.keys(capturedFilters).forEach((key) =>
      targetUrl.searchParams.set(key, capturedFilters[key]),
    );

    /*
      We compare the URLs to not get stuck in an infinite loop,
      since goto will also trigger beforeNavigate.
    */
    if (targetUrl.href === nav.to.url.href) return;

    nav.cancel();
    goto(targetUrl);
  });
</script>
