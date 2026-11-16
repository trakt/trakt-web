<script lang="ts">
  import { page } from "$app/state";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useWebviewSession } from "$lib/features/webview/useWebviewSession";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { Snippet } from "svelte";
  import { useFreeYearReview } from "./_internal/free/useFreeYearReview";
  import YirFree from "./_internal/free/YirFree.svelte";
  import { parsePersonaPreview } from "./_internal/parsePersonaPreview";
  import { parseTierPreview } from "./_internal/parseTierPreview";
  import Yir2026Vip from "./_internal/Yir2026Vip.svelte";
  import YirPersonaToggles from "./_internal/YirPersonaToggles.svelte";

  const {
    detail,
    slug,
    year,
    fallback,
    profile,
    isTierKnown,
    canBeVip,
  }: {
    detail: YirDetail | null;
    isLoading: boolean;
    slug: string;
    year: number;
    fallback: Snippet;
    profile: UserProfile | null;
    isTierKnown: boolean;
    canBeVip: boolean;
  } = $props();

  const { isMe } = $derived(useIsMe(slug));

  const name = $derived(profile?.name.first || profile?.username || slug);
  const privateName = $derived.by(() => {
    if ($isMe) return undefined;
    return profile ? toDisplayableName(profile) : slug;
  });

  const isFreePreview = $derived(parseTierPreview(page.url.searchParams));
  const isFree = $derived(isFreePreview || (isTierKnown && !canBeVip));

  const { review: freeReview } = useFreeYearReview(
    fromRune(() => ({ year, isEnabled: isFree && $isMe })),
  );

  const { track } = useTrack(AnalyticsEvent.YearReviewView);
  let lastTrackedView: string | undefined;

  const isPreview = $derived(
    isFreePreview || parsePersonaPreview(page.url.searchParams) !== undefined,
  );

  const trackView = (tier: "free" | "vip") => {
    if (isPreview) return;

    const view = `${slug}/${year}`;
    if (lastTrackedView === view) return;

    lastTrackedView = view;
    track({ tier, owner: $isMe ? "me" : "other" });
  };

  $effect(() => {
    if (isFree && $freeReview) trackView("free");
  });

  const webview = useWebviewSession();
</script>

{#if !isFree && isTierKnown}
  <Yir2026Vip
    {detail}
    {slug}
    {year}
    {name}
    isMe={$isMe}
    {fallback}
    onview={() => trackView("vip")}
  />
{:else}
  <NavbarStateSetter mode={webview.isStandalone ? "hidden" : "minimal"} />
  {#if isFree}
    <YirFree {slug} {year} review={$freeReview} {privateName} />
    <YirPersonaToggles persona={null} runnerUp={null} />
  {/if}
{/if}
