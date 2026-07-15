<script lang="ts">
  import { page } from "$app/state";
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import Settings from "$lib/sections/settings/Settings.svelte";
  import { settingsNavbarHeader } from "$lib/sections/settings/settingsNavbarHeader.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { children } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);

  const header = $derived(
    settingsNavbarHeader({
      pathname: page.url.pathname,
      isCompact: $isMobile || $isTabletSmall,
    }),
  );
</script>

{#snippet headerActions()}
  <RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
    <LogoutButton style="action" />
  </RenderFor>
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_settings()}
>
  <NavbarStateSetter showFilters={false} {headerActions} {header} />
  <TraktPageCoverSetter />

  <Settings>
    {@render children()}
  </Settings>
</TraktPage>
