<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfilePageBanner from "$lib/sections/profile-banner/ProfilePageBanner.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();
</script>

<ProfileContainer {profile} {slug}>
  <ProfilePageBanner {profile} {slug} compact />
  <div class="trakt-private-profile">
    <p class="bold">{m.header_private_profile()}</p>
    <hr class="trakt-private-profile-divider" />
    <p class="trakt-profile-description">
      {m.text_private_profile_description({ username: profile.username })}
    </p>
  </div>
</ProfileContainer>

<style>
  .trakt-private-profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    gap: var(--gap-xs);

    p.trakt-profile-description {
      max-width: var(--ni-320);
      line-height: 150%;
    }
  }

  .trakt-private-profile-divider {
    all: unset;
    display: block;
    height: 1px;
    width: var(--ni-320);
    max-width: 100%;
    margin: var(--gap-s) 0;
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 10%,
      transparent
    );
  }
</style>
