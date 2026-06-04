<script lang="ts">
  import { page } from "$app/state";
  import MyStatsDrawerHost from "../stats/MyStatsDrawerHost.svelte";
  import {
    ProfileDrawers,
    profileDrawerNavigation,
  } from "./_internal/profileDrawerNavigation.ts";
  import ActivityDrawerHost from "./components/_internal/drawers/ActivityDrawerHost.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps.ts";
  import MatchDrawerHost from "./_internal/MatchDrawerHost.svelte";

  const { slug, profile }: DisplayableProfileProps = $props();

  const { drawer, sourceCommentId, close } = $derived(
    profileDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === ProfileDrawers.MyStats}
  <MyStatsDrawerHost onClose={close} />
{:else if drawer === ProfileDrawers.Activity}
  <ActivityDrawerHost {sourceCommentId} onClose={close} />
{:else if drawer === ProfileDrawers.Match}
  <MatchDrawerHost {slug} {profile} onClose={close} />
{/if}
