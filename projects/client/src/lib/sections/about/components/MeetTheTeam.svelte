<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useTraktTeam } from "$lib/features/team/useTraktTeam.ts";
  import ProfileCard from "$lib/sections/profile/components/ProfileCard.svelte";
  import { revealOnView } from "$lib/utils/actions/revealOnView.ts";
  import { of } from "rxjs";

  const { isLoading, team } = useTraktTeam(of([]));

  const teamSize = 10;
  const REVEAL_STEP = 80;
  const MAX_REVEAL_STEPS = 5;
</script>

<section class="trakt-meet-the-team">
  <h2 class="meet-the-team-heading">{m.heading_meet_the_team()}</h2>

  {#if !$isLoading}
    <div class="team-grid">
      {#each $team as member, i (member.username)}
        <div
          class="team-card"
          use:revealOnView={{
            delay: Math.min(i, MAX_REVEAL_STEPS) * REVEAL_STEP,
          }}
        >
          <ProfileCard profile={member} />
        </div>
      {/each}
    </div>
  {:else}
    <div class="team-grid">
      {#each { length: teamSize } as _, i (i)}
        <div class="team-card team-card-skeleton" aria-hidden="true">
          <Skeleton width="var(--ni-80)" height="var(--ni-80)" radius="50%" />
          <Skeleton width="60%" height="var(--ni-18)" />
          <Skeleton width="40%" height="var(--ni-12)" />
        </div>
      {/each}
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-meet-the-team {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    width: 100%;
  }

  .meet-the-team-heading {
    font-size: var(--ni-32);
    text-align: center;

    @include for-mobile {
      font-size: var(--font-size-title);
    }
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-200), 1fr));
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--gap-s);
    }
  }

  .team-card {
    box-sizing: border-box;
    min-height: var(--ni-184);
    padding: var(--gap-m) var(--gap-s);

    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;

    background: var(--color-card-background);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-raised);
  }

  .team-card-skeleton {
    align-items: center;
    gap: var(--gap-s);
  }
</style>
