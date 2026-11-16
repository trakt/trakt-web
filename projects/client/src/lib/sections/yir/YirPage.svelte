<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { YirYear } from "$lib/requests/models/YirYear";
  import { useQuery } from "$lib/features/query/useQuery";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map, of } from "rxjs";
  import ReviewPageShell from "./_internal/ReviewPageShell.svelte";
  import YirHeader from "./_internal/YirHeader.svelte";
  import { useYirDetail } from "./_internal/useYirDetail";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import Yir2026 from "./2026/Yir2026.svelte";
  import YirAllTime from "./all-time/YirAllTime.svelte";
  import { getYirTemplate } from "./getYirTemplate";

  const { slug, year }: { slug: string; year: YirYear } = $props();

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(slug));
  const profileQuery = useQuery(
    fromRune(() => slug).pipe(
      map(($slug) => userProfileQuery({ slug: $slug })),
    ),
  );
  const profile = profileQuery.pipe(map(($query) => $query.data));
  const isProfileLoading = profileQuery.pipe(map(toLoadingState));

  const isTierKnown = $derived(
    $isMe ? Boolean($user) : Boolean($profile) || !$isProfileLoading,
  );
  const canBeVip = $derived(
    $isMe
      ? Boolean($user?.isVip)
      : Boolean($profile?.isVip || $profile?.isDirector),
  );
  const canLoadDetail = $derived(
    year === 2026 ? canBeVip : !$isMe || Boolean($user?.isVip),
  );
  const { detail, isLoading } = $derived(
    canLoadDetail
      ? useYirDetail({ slug, year })
      : { detail: of(null), isLoading: of(false) },
  );
</script>

{#snippet review()}
  <!-- The 2024 template's hero is theme-aware (not a dark poster), so its header
       text tracks the theme; every other year uses the white-on-poster default. -->
  <ReviewPageShell
    id="year-in-review"
    headerForeground={year === 2024 ? "theme" : "poster"}
  >
    <YirHeader {slug} {year} />
    <!-- Always mount the template so its scaffold (header text, hero shell)
         paints immediately; detail-dependent sections inside the template
         gate on `detail` and fill in once the query lands. -->
    {#if year === "all"}
      <YirAllTime detail={$detail ?? null} isLoading={$isLoading} {slug} />
    {:else}
      {@const Template = getYirTemplate(year)}
      <Template detail={$detail ?? null} isLoading={$isLoading} {slug} {year} />
    {/if}
  </ReviewPageShell>
{/snippet}

{#if year === 2026}
  <RenderForFeature flag={FeatureFlag.YearInReview2026} audience="director">
    {#snippet enabled()}
      <Yir2026
        detail={$detail ?? null}
        isLoading={$isLoading}
        {slug}
        year={2026}
        fallback={review}
        profile={$profile ?? null}
        {isTierKnown}
        {canBeVip}
      />
    {/snippet}
    {@render review()}
  </RenderForFeature>
{:else}
  {@render review()}
{/if}
