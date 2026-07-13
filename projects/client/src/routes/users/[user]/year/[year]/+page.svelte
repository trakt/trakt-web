<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ReviewRouteLayout from "$lib/sections/yir/ReviewRouteLayout.svelte";
  import YirPage from "$lib/sections/yir/YirPage.svelte";
  import type { YirYear } from "$lib/requests/models/YirYear";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const now = new Date();
  const month = now.getMonth();
  // "all" and concrete years share this route so the header persists across
  // the whole period nav loop without remounting.
  const isAllTime = $derived(params.year === "all");
  const year = $derived<YirYear>(isAllTime ? "all" : Number(params.year));

  const isCurrentYear = $derived(!isAllTime && year === now.getFullYear());
  const isYtd = $derived(isCurrentYear && month > 0 && month < 11);

  const pageTitle = $derived(
    isAllTime
      ? m.page_title_all_time_stats()
      : isYtd
        ? m.page_title_year_to_date()
        : m.page_title_year_in_review({ year: params.year }),
  );
  const pageImage = $derived(
    params.user === "me"
      ? undefined
      : UrlBuilder.og.widgets.yir(params.user, params.year),
  );
</script>

<ReviewRouteLayout user={params.user} title={pageTitle} image={pageImage}>
  <YirPage slug={params.user} {year} />
</ReviewRouteLayout>
