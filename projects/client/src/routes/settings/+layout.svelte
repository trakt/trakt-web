<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import Settings from "$lib/sections/settings/Settings.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { children } = $props();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_settings()}
>
  <TraktPageCoverSetter />

  <Settings>
    {@render children()}
  </Settings>
</TraktPage>
