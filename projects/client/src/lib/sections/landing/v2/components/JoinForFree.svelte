<script lang="ts">
  import { useTraktTeam } from "$lib/features/team/useTraktTeam";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import JoinForFreeButton from "./JoinForFreeButton.svelte";

  const PROFILE_COUNT = 3;

  const { isLoading, team } = useTraktTeam([], PROFILE_COUNT);
</script>

<div class="trakt-join-for-free">
  <div class="trakt-landing-social-proof">
    <div class="trakt-social-proof-stats">
      <h4>15</h4>
      <div class="trakt-social-proof-lines">
        <p class="smaller">years of watching together</p>
        <p class="smaller">mil. shows & movie lovers</p>
        <p class="smaller">mil. minutes tracked daily</p>
      </div>
    </div>
    <div
      class="trakt-landing-profiles"
      style="--profile-count: {PROFILE_COUNT}"
    >
      {#if !$isLoading}
        {#each $team as member, index (member.username)}
          <div class="trakt-team-member" style="--user-index: {index}">
            <UserAvatar user={member} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <div class="trakt-join-for-free-button">
    <JoinForFreeButton />
    <span class="meta-info secondary">
      Track everything you watch, wherever you stream it.
    </span>
  </div>
</div>

<style>
  .trakt-join-for-free {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-12);
    border-radius: var(--border-radius-xxl);

    background-color: color-mix(
      in srgb,
      var(--purple-400) 10%,
      transparent 90%
    );
  }

  .trakt-landing-social-proof {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-s);
  }

  .trakt-social-proof-stats {
    display: flex;
    gap: var(--gap-xs);

    flex-shrink: 0;

    h4 {
      display: flex;
      align-items: center;
      font-size: 52px;
      line-height: 52px;
    }

    .trakt-social-proof-lines {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .trakt-landing-profiles {
    --avatars-width: 100%;
    --avatar-size: var(--ni-52);
    --avatar-offset: calc(
      (var(--avatars-width) - var(--avatar-size)) / (var(--profile-count) - 1)
    );
    position: relative;

    display: flex;
    align-items: center;
    flex: 1;

    height: 100%;
    width: var(--avatars-width);

    .trakt-team-member {
      position: absolute;
      left: calc(var(--user-index) * var(--avatar-offset));
    }

    :global(.trakt-user-avatar) {
      width: var(--avatar-size);
      height: var(--avatar-size);
    }
  }

  .trakt-join-for-free-button {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    span.meta-info {
      letter-spacing: 0.015rem;
      align-self: center;
    }
  }
</style>
