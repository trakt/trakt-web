<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import Settings from "$lib/sections/settings/Settings.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { children } = $props();
</script>

{#snippet headerActions()}
  <LogoutButton style="action" />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_settings()}
>
  <NavbarStateSetter
    showFilters={false}
    {headerActions}
    header={{ title: m.page_title_settings() }}
  />
  <TraktPageCoverSetter />

  <Settings>
    {@render children()}
  </Settings>
</TraktPage>
