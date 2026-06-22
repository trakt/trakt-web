<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import { useIsFollowing } from "$lib/features/auth/stores/useIsFollowing.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import PrivateProfile from "$lib/sections/profile/PrivateProfile.svelte";
  import Profile from "$lib/sections/profile/Profile.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { PageProps } from "./$types";
  import { useProfile } from "./useProfile";

  const { params }: PageProps = $props();

  const slug$ = fromRune(() => params.slug);

  const { user, isLoading } = useProfile(slug$);
  const { isMe } = $derived(useIsMe(params.slug));
  const { isFollowing } = $derived(useIsFollowing(params.slug));

  const isPrivateProfile = $derived(
    $user?.private === true && !$isMe && $isFollowing === false,
  );
  const isProfileVisible = $derived(
    $user != null &&
      ($isMe === true || $isFollowing === true || !$user.private),
  );

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
  filterScope="global"
>
  <RenderFor audience="authenticated">
    <NavbarStateSetter>
      {#snippet actions()}
        <DiscoverToggles />
      {/snippet}
    </NavbarStateSetter>
  </RenderFor>

  {#if !$isLoading && $user}
    <CoverImageSetter src={$user.cover?.url} type="main" />
    {#if isPrivateProfile}
      <PrivateProfile profile={$user} slug={$user.slug ?? ""} />
    {:else if isProfileVisible}
      <Profile profile={$user} slug={$user.slug ?? ""} />
    {/if}
  {/if}
</TraktPage>
