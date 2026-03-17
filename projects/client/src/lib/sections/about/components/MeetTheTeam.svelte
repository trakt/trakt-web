<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useTraktTeam } from "$lib/features/team/useTraktTeam.ts";
  import TeamMemberCard from "./TeamMemberCard.svelte";

  const { network } = useUser();
  const { isLoading, team } = $derived(useTraktTeam($network?.following ?? []));
</script>

<section class="trakt-meet-the-team">
  <h2 class="meet-the-team-heading">{m.heading_meet_the_team()}</h2>

  {#if !$isLoading}
    <div class="team-grid">
      {#each $team as member (member.username)}
        <TeamMemberCard {member} />
      {/each}
    </div>
  {:else}
    <div class="team-grid">
      {#each { length: 6 } as _, i (i)}
        <div class="team-member-skeleton"></div>
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

  .team-member-skeleton {
    height: var(--ni-248);
    border-radius: var(--border-radius-xxl);
    background: color-mix(
      in srgb,
      var(--color-card-background) 60%,
      transparent
    );
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
</style>
