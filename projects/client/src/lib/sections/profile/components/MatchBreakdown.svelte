<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { buildMatchStage } from "./_internal/buildMatchStage.ts";
  import { buildMatchStrip } from "./_internal/buildMatchStrip.ts";
  import MatchBreakdownSkeleton from "./_internal/MatchBreakdownSkeleton.svelte";
  import MatchHero from "./_internal/MatchHero.svelte";
  import { matchLabel } from "./_internal/matchLabel.ts";
  import MatchTopics from "./_internal/MatchTopics.svelte";
  import MatchTitleStage from "./_internal/MatchTitleStage.svelte";
  import type { MatchBreakdownProps } from "./MatchBreakdownProps.ts";

  const maxTopics = 6;

  const { match, user, profile }: MatchBreakdownProps = $props();

  const strip = $derived(match ? buildMatchStrip(match.shared) : []);
  const shared = $derived(match?.shared.watched ?? match?.shared.favorites);
  const stage = $derived(
    buildMatchStage(
      strip,
      (shared?.movies.length ?? 0) + (shared?.shows.length ?? 0),
    ),
  );
  const topics = $derived(match?.shared.subgenres.slice(0, maxTopics) ?? []);
</script>

<div class="trakt-match-breakdown">
  {#if match}
    <MatchHero
      score={match.score}
      label={matchLabel(match.score)}
      {user}
      {profile}
      backdropEntry={strip.at(0)}
    />

    {#if topics.length > 0}
      <MatchTopics {topics} />
    {:else}
      <p class="no-topics secondary">{m.match_drawer_no_shared_topics()}</p>
    {/if}

    <MatchTitleStage {stage} />
  {:else}
    <MatchBreakdownSkeleton />
  {/if}
</div>

<style lang="scss">
  .trakt-match-breakdown {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);
  }

  .no-topics {
    text-align: center;
  }
</style>
