<script lang="ts">
  import { page } from "$app/state";
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import PrivateProfile from "$lib/sections/profile/PrivateProfile.svelte";
  import Profile from "$lib/sections/profile/Profile.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { useProfile } from "./useProfile";

  const { user, isLoading } = $derived(useProfile(page.params.slug));

  const title = $derived(
    $user?.username
      ? m.page_title_user_profile({ username: $user.username })
      : m.page_title_profile(),
  );
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  {title}
  hasDynamicContent={true}
>
  {#if !$isLoading && $user}
    <CoverImageSetter src={$user.cover?.url} type="main" />
    {#if $user.private}
      <PrivateProfile profile={$user} />
    {:else}
      <Profile profile={$user} slug={$user.slug ?? ""} />
    {/if}
  {/if}
</TraktPage>
