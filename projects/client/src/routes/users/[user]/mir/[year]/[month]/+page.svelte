<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import MonthInReviewPage from "$lib/sections/month-in-review/MonthInReviewPage.svelte";
  import ReviewRouteLayout from "$lib/sections/yir/ReviewRouteLayout.svelte";
  import MirPage from "$lib/sections/yir/MirPage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const year = $derived(Number(params.year));
  const month = $derived(Number(params.month));
</script>

<ReviewRouteLayout
  user={params.user}
  title={m.page_title_month_in_review()}
  image={UrlBuilder.api.mirShareableImage({
    slug: params.user,
    year,
    month,
  })}
>
  <RenderForFeature
    flag={FeatureFlag.MonthInReviewRedesign}
    audience="director"
  >
    {#snippet enabled()}
      <MonthInReviewPage slug={params.user} {year} {month} />
    {/snippet}

    <MirPage slug={params.user} {year} {month} />
  </RenderForFeature>
</ReviewRouteLayout>
