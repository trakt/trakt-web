<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useTraktTeam } from "$lib/features/team/useTraktTeam";
  import UserAvatar from "../../UserAvatar.svelte";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { SocialCta } from "../models/Cta";

  const {
    intl,
    limit,
    cta,
  }: { intl: CtaItemIntl; limit?: number; cta: SocialCta } = $props();

  const { track } = useTrack(AnalyticsEvent.Cta);
  const { network } = useUser();
  const { isLoading, team } = $derived(useTraktTeam($network?.following ?? []));
</script>

<div class="trakt-team">
  <p class="smaller">
    {intl.text({ cta })}
  </p>
  <div class="trakt-team-list">
    {#if !$isLoading}
      {#each $team.slice(0, limit ?? $team.length) as member (member.username)}
        <div class="trakt-team-member">
          <UserAvatar user={member} onClick={() => track({ type: cta.type })} />
        </div>
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-team {
    display: flex;
    flex-direction: column;

    gap: var(--gap-m);
  }

  .trakt-team-list {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    gap: var(--gap-s);

    @include for-mobile {
      justify-content: space-around;
    }
  }

  .trakt-team-member {
    position: relative;
    transition: opacity var(--transition-increment) ease-in-out;

    :global(svg) {
      width: var(--ni-22);
      height: var(--ni-22);

      position: absolute;
      top: var(--ni-neg-8);
      right: var(--ni-neg-4);
    }
  }
</style>
