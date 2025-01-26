<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import Profile from "$lib/sections/profile/Profile.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.profile()}
>
  <TraktPageCoverSetter />
  {#if current() != null}
    <Profile />
  {/if}
</TraktPage>
