<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useQuery } from "$lib/features/query/useQuery";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { useWebviewSession } from "$lib/features/webview/useWebviewSession";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import { tick, type Snippet } from "svelte";
  import { yirBeats } from "./_internal/persona/yirBeats";
  import ReviewPageShell from "../_internal/ReviewPageShell.svelte";
  import YirHeader from "../_internal/YirHeader.svelte";
  import YirUpgradeSection from "../_internal/YirUpgradeSection.svelte";
  import { parsePersonaPreview } from "./_internal/parsePersonaPreview";
  import { parseTierPreview } from "./_internal/parseTierPreview";
  import { useFreeYearReview } from "./_internal/free/useFreeYearReview";
  import YirFree from "./_internal/free/YirFree.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { useReelSeen } from "./_internal/useReelSeen";
  import { useYirPersona } from "./_internal/useYirPersona";
  import Yir2026Hero from "./_internal/Yir2026Hero.svelte";
  import Yir2026Scenes from "./_internal/Yir2026Scenes.svelte";
  import YirPersonaTheme from "./_internal/persona/YirPersonaTheme.svelte";
  import YirPersonaToggles from "./_internal/YirPersonaToggles.svelte";
  import YirReel from "./_internal/reel/YirReel.svelte";

  const {
    detail,
    slug,
    year,
    fallback,
  }: {
    detail: YirDetail | null;
    isLoading: boolean;
    slug: string;
    year: number;
    fallback: Snippet;
  } = $props();

  const { persona, isLoading: isPersonaLoading } = useYirPersona(
    fromRune(() => ({
      slug,
      year,
      preview: parsePersonaPreview(page.url.searchParams),
    })),
  );

  const { isMe } = $derived(useIsMe(slug));
  const { isSeen, markSeen } = $derived(useReelSeen(year));

  const profile = useQuery(
    fromRune(() => slug).pipe(
      map(($slug) => userProfileQuery({ slug: $slug })),
    ),
  ).pipe(map(($query) => $query.data));
  const name = $derived(
    $profile?.name.first || $profile?.username || slug,
  );

  const { user } = useUser();
  const isFreePreview = $derived(parseTierPreview(page.url.searchParams));
  const isTierKnown = $derived($isMe ? Boolean($user) : Boolean($profile));
  const canBeVip = $derived(
    $isMe
      ? Boolean($user?.isVip)
      : Boolean($profile?.isVip || $profile?.isDirector),
  );
  const isFree = $derived(isFreePreview || (isTierKnown && !canBeVip));

  const { review: freeReview } = useFreeYearReview(
    fromRune(() => ({ year, isEnabled: isFree && $isMe })),
  );

  const { track: trackView } = useTrack(AnalyticsEvent.YearReviewView);
  let lastTrackedView: string | undefined;

  const isPreview = $derived(
    isFreePreview || parsePersonaPreview(page.url.searchParams) !== undefined,
  );
  const hasReview = $derived(
    isFree ? Boolean($freeReview) : Boolean($persona),
  );

  $effect(() => {
    if (isPreview || !hasReview) return;

    const view = `${slug}/${year}`;
    if (lastTrackedView === view) return;

    lastTrackedView = view;
    trackView({
      tier: isFree ? "free" : "vip",
      owner: $isMe ? "me" : "other",
    });
  });

  const isReelRequested = $derived(page.url.searchParams.get("reel") === "1");
  const isReelOpen = $derived(
    !isFree && (isReelRequested || ($isMe && !$isSeen)),
  );

  const webview = useWebviewSession();
  const navbarMode = $derived(
    webview.isStandalone || isReelOpen ? "hidden" : "minimal",
  );

  const setReel = (open: boolean) => {
    const url = new URL(page.url);
    if (open) url.searchParams.set("reel", "1");
    else url.searchParams.delete("reel");
    return goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  };

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  let arrivals = $state(0);

  const closeReel = () => {
    if ($isMe) markSeen();

    if ($isReducedMotion || !document.startViewTransition) {
      setReel(false);
      return;
    }

    const root = document.documentElement;
    root.dataset.yirTransition = "";
    root.style.setProperty("--yir-beat", `${yirBeats(1)}ms`);
    const transition = document.startViewTransition(async () => {
      arrivals += 1;
      await setReel(false);
      await tick();
    });
    transition.finished.finally(() => {
      delete root.dataset.yirTransition;
      root.style.removeProperty("--yir-beat");
    });
  };
</script>

<NavbarStateSetter mode={navbarMode} />

{#if isFree}
  <YirFree
    {slug}
    {year}
    review={$freeReview}
    privateName={!$isMe && $profile ? toDisplayableName($profile) : undefined}
  />
  {@render toggles(false)}
{:else if $persona}
  <YirPersonaTheme persona={$persona.persona} runnerUp={$persona.runnerUp}>
    <div class="yir-2026-page" class:is-covered={isReelOpen}>
      <ReviewPageShell id="year-in-review" headerForeground="theme">
        <YirHeader {slug} {year} />
        {#key arrivals}
          <Yir2026Hero
            result={$persona}
            {detail}
            {name}
            isMe={$isMe}
            isMorphTarget={!isReelOpen}
            hasArrived={arrivals > 0}
            onreplay={() => setReel(true)}
          />
        {/key}
        <Yir2026Scenes {detail} {slug} {year} />
        <YirUpgradeSection {slug} source="yir" />
      </ReviewPageShell>
    </div>

    {#if isReelOpen}
      <YirReel result={$persona} {detail} {name} {year} onclose={closeReel}>
        {#snippet overlay()}
          {@render toggles(true)}
        {/snippet}
      </YirReel>
    {:else}
      {@render toggles(false)}
    {/if}
  </YirPersonaTheme>
{:else if !$isPersonaLoading}
  {@render fallback()}
  {@render toggles(false)}
{/if}


{#snippet toggles(isRaised: boolean)}
  <YirPersonaToggles
    persona={$persona?.persona}
    runnerUp={$persona?.runnerUp}
    {isRaised}
  />
{/snippet}

<style>
  .yir-2026-page.is-covered {
    content-visibility: hidden;
  }

  :global(:root[data-yir-transition]::view-transition-old(root)) {
    animation: yir-reel-out calc(var(--yir-beat) * 6.5) cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  :global(:root[data-yir-transition]::view-transition-new(root)) {
    animation: yir-page-in calc(var(--yir-beat) * 8) cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--yir-beat) * 1.2) both;
  }

  :global(:root[data-yir-transition]::view-transition-group(yir-persona-card)) {
    animation-duration: calc(var(--yir-beat) * 9);
    animation-timing-function: cubic-bezier(0.65, 0, 0.2, 1);
    z-index: 1;
  }

  :global(:root[data-yir-transition]::view-transition-old(yir-persona-card)) {
    display: none;
  }

  :global(:root[data-yir-transition]::view-transition-new(yir-persona-card)) {
    animation: none;
    height: 100%;
  }

  @keyframes -global-yir-reel-out {
    to {
      opacity: 0;
      transform: scale(1.08);
      filter: blur(12px);
    }
  }

  @keyframes -global-yir-page-in {
    from {
      opacity: 0;
      transform: translateY(4vh) scale(0.97);
    }
  }
</style>
