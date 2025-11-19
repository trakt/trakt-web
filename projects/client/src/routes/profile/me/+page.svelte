<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import Profile from "$lib/sections/profile/Profile.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { user } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_profile()}
  hasDynamicContent={true}
>
  <RenderFor audience="authenticated">
    <NavbarStateSetter mode="minimal" />
  </RenderFor>

  <TraktPageCoverSetter />

  {#if $user !== null}
    <Profile profile={$user} slug="me" />
  {/if}
</TraktPage>
