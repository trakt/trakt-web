<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

  // FIXME: proper design for private profiles
</script>

<ProfileContainer {profile} {slug}>
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

    p.trakt-profile-description {
      max-width: var(--ni-224);
      line-height: 150%;
    }
  }
</style>
