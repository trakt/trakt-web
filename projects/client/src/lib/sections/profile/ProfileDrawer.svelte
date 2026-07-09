<script lang="ts">
  import { page } from "$app/state";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import ScreenTimeDrawerHost from "../stats/ScreenTimeDrawerHost.svelte";
  import MatchDrawerHost from "./_internal/MatchDrawerHost.svelte";
  import {
    ProfileDrawers,
    profileDrawerNavigation,
  } from "./_internal/profileDrawerNavigation.ts";
  import ActivityDrawerHost from "./components/_internal/drawers/ActivityDrawerHost.svelte";
  import LeaderboardDrawerHost from "./leaderboard/LeaderboardDrawerHost.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps.ts";

  const { slug, profile }: DisplayableProfileProps = $props();

  const { drawer, sourceCommentId, close } = $derived(
    profileDrawerNavigation(page.url.searchParams),
  );

  const { isEnabled } = useFeatureFlag();
  const leaderboardEnabled = isEnabled(FeatureFlag.Leaderboard);
</script>

{#if drawer === ProfileDrawers.ScreenTime}
  <ScreenTimeDrawerHost onClose={close} />
{:else if drawer === ProfileDrawers.Activity}
  <ActivityDrawerHost {sourceCommentId} onClose={close} />
{:else if drawer === ProfileDrawers.Match}
  <MatchDrawerHost {slug} {profile} onClose={close} />
{:else if drawer === ProfileDrawers.Leaderboard && $leaderboardEnabled}
  <LeaderboardDrawerHost {slug} onClose={close} />
{/if}
