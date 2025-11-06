<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import PrivateProfile from "$lib/sections/profile/PrivateProfile.svelte";
  import Profile from "$lib/sections/profile/Profile.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import type { PageProps } from "./$types";
  import { useProfile } from "./useProfile";

  const { params }: PageProps = $props();

  const { user, isLoading } = $derived(useProfile(params.slug));

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
  <NavbarStateSetter mode="minimal" />

  {#if !$isLoading && $user}
    <CoverImageSetter src={$user.cover?.url} type="main" />
    {#if $user.private}
      <PrivateProfile profile={$user} />
    {:else}
      <Profile profile={$user} slug={$user.slug ?? ""} />
    {/if}
  {/if}
</TraktPage>
