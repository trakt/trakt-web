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
      <span class="bold trakt-social-proof-count">15</span>
      <div class="trakt-social-proof-lines">
        <p>years of watching together</p>
        <p>mil. shows & movie lovers</p>
        <p>mil. titles tracked weekly</p>
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
    <span class="secondary">
      Track everything you watch, wherever you stream it.
    </span>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-join-for-free {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-24);
    border-radius: var(--border-radius-xxl);

    background-color: color-mix(
      in srgb,
      var(--purple-400) 10%,
      transparent 90%
    );

    @include for-tablet-lg-and-below() {
      gap: var(--gap-s);
      padding: var(--ni-12);
    }
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

    .trakt-social-proof-count {
      display: flex;
      align-items: center;
      font-size: var(--ni-52);
      line-height: var(--ni-52);
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
    gap: var(--gap-s);

    span.secondary {
      align-self: center;
    }

    @include for-tablet-lg-and-below() {
      gap: var(--gap-xxs);
    }
  }
</style>
