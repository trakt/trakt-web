<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import ProfileContainer from "./components/ProfileContainer.svelte";

  const { profile }: { profile: UserProfile } = $props();
  // FIXME: proper design for private profiles
</script>

<ProfileContainer>
  {#snippet details()}
    <div class="trakt-private-profile-avatar">
      <CircularLogo />
      <span class="title">{profile.username}</span>
    </div>
  {/snippet}
  <div class="trakt-private-profile">
    <p class="bold">{m.header_private_profile()}</p>
    <p class="trakt-profile-description">
      {m.text_private_profile_description({ username: profile.username })}
    </p>
  </div>
</ProfileContainer>

<style>
  .trakt-private-profile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: var(--gap-m);
    height: var(--ni-232);

    color: var(--shade-10);
    background-color: var(--shade-600);

    border-radius: var(--border-radius-l);
    padding: var(--ni-32);
    box-sizing: border-box;

    p.trakt-profile-description {
      max-width: var(--ni-224);
      line-height: 150%;
    }
  }

  .trakt-private-profile-avatar {
    margin-left: var(--ni-72);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-m);

    :global(svg) {
      width: var(--ni-64);
      height: var(--ni-64);
    }
  }
</style>
