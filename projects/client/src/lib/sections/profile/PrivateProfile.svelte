<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import ProfileContainer from "./components/ProfileContainer.svelte";

  const { profile }: { profile: UserProfile } = $props();
  // FIXME: proper design for private profiles
</script>

<ProfileContainer>
  <div class="trakt-private-profile">
    <h5>{m.private_profile({ username: profile.username })}</h5>
    <h6>
      {m.private_profile_description({ username: profile.username })}
    </h6>
  </div>
</ProfileContainer>

<style>
  .trakt-private-profile {
    display: flex;
    flex-direction: column;

    gap: var(--gap-m);
  }
</style>
