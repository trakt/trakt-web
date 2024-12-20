<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import Profile from "$lib/sections/profile/Profile.svelte";

  const { current } = useUser();
</script>

<TraktPage title={m.profile()}>
  {#if current() != null}
    <BackgroundCoverImage src={current().cover.url} type="main" />
    <Profile />
  {/if}
</TraktPage>
