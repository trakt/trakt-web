<script lang="ts">
  import "../style";

  import { page } from "$app/state";
  import CoverImage from "$lib/components/background/CoverImage.svelte";
  import CoverProvider from "$lib/components/background/CoverProvider.svelte";
  import ListScrollHistoryProvider from "$lib/components/lists/section-list/ListScrollHistoryProvider.svelte";
  import AnalyticsProvider from "$lib/features/analytics/AnalyticsProvider.svelte";
  import PageView from "$lib/features/analytics/PageView.svelte";
  import AuthProvider from "$lib/features/auth/components/AuthProvider.svelte";
  import ConfirmationProvider from "$lib/features/confirmation/ConfirmationProvider.svelte";
  import CookieConsentProvider from "$lib/features/cookie-consent/CookieConsentProvider.svelte";
  import { DeploymentEndpoint } from "$lib/features/deployment/DeploymentEndpoint.js";
  import DiscoverProvider from "$lib/features/discover/DiscoverProvider.svelte";
  import ErrorProvider from "$lib/features/errors/ErrorProvider.svelte";
  import FeatureFlagProvider from "$lib/features/feature-flag/FeatureFlagProvider.svelte";
  import FilterProvider from "$lib/features/filters/FilterProvider.svelte";
  import LocaleProvider from "$lib/features/i18n/components/LocaleProvider.svelte";
  import NavigationProvider from "$lib/features/navigation/NavigationProvider.svelte";
  import GlobalParameterProvider from "$lib/features/parameters/GlobalParameterProvider.svelte";
  import PlayerProvider from "$lib/features/player/PlayerProvider.svelte";
  import QueryClientProvider from "$lib/features/query/QueryClientProvider.svelte";
  import RedirectProvider from "$lib/features/redirect/RedirectProvider.svelte";
  import SearchProvider from "$lib/features/search/SearchProvider.svelte";
  import ThemeProvider from "$lib/features/theme/components/ThemeProvider.svelte";
  import { initializeSeasonalThemes } from "$lib/features/theme/initializeSeasonalThemes.js";
  import ToastProvider from "$lib/features/toast/ToastProvider.svelte";
  import WSInvalidator from "$lib/features/websocket/WSInvalidator.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedDrawerProvider from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedDrawerProvider.svelte";
  import MobileNavbar from "$lib/sections/navbar/MobileNavbar.svelte";
  import SideNavbar from "$lib/sections/navbar/SideNavbar.svelte";
  import TopNavbar from "$lib/sections/navbar/TopNavbar.svelte";
  import NavbarToastContent from "$lib/sections/toast/NavbarToastContent.svelte";
  import { isPWA } from "$lib/utils/devices/isPWA.ts";
  import { WorkerMessage } from "$worker/WorkerMessage";
  import { workerRequest } from "$worker/workerRequest";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { onMount } from "svelte";

  const { data, children } = $props();

  $effect.pre(initializeSeasonalThemes);

  onMount(async () => {
    if (isPWA()) {
      document.body.classList.add("trakt-pwa");
    }

    const ACTIVE_SHA = TRAKT_GIT_SHA;
    const DEPLOYED_SHA = await fetch(DeploymentEndpoint.Get).then((res) =>
      res.text(),
    );

    if (ACTIVE_SHA === DEPLOYED_SHA) {
      return;
    }

    await workerRequest(WorkerMessage.CacheBust);
  });
</script>

<svelte:head>
  <title>Trakt Web</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <!-- FIXME: remove walter when all sources are from media.trakt.tv -->
  <link
    rel="preconnect"
    href="https://walter-r2.trakt.tv"
    crossorigin="anonymous"
  />
  <link
    rel="preconnect"
    href="https://media.trakt.tv"
    crossorigin="anonymous"
  />
  <link rel="preconnect" href="https://cdn.plyr.io" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300..700&display=swap"
    rel="stylesheet"
  />
  <!-- Plyr CSS -->
  <link rel="stylesheet" href="https://cdn.plyr.io/3.8.3/plyr.css" />
  <!-- Plyr JS -->
  <script src="https://cdn.plyr.io/3.8.3/plyr.js"></script>
  <style>
    html,
    body {
      margin: 0;
      padding: 0;

      width: 100%;
      height: -moz-available;
      height: -webkit-fill-available;
      height: fill-available;
    }

    html::before {
      content: "";
      height: 100vh;
      width: 100vw;
      z-index: calc(var(--layer-background) - 1);

      display: block;
      position: fixed;

      background-color: var(--color-background);
    }

    body {
      background-color: var(--color-background);
      color: var(--color-foreground);
      font-family: "Roboto", Arial, sans-serif;
    }

    body:has(dialog[open]),
    body.dialog-open {
      overflow: hidden;
    }
  </style>
</svelte:head>

<ErrorProvider>
  <QueryClientProvider client={data.queryClient}>
    <GlobalParameterProvider>
      <AuthProvider
        isAuthorized={data.oidcAuth.isAuthorized}
        accessToken={data.oidcAuth.token}
      >
        <WSInvalidator />
        <FeatureFlagProvider>
          <CookieConsentProvider consent={data.cookieConsent}>
            <PlayerProvider>
              <AnalyticsProvider>
                <RedirectProvider>
                  <NavigationProvider>
                    <LocaleProvider>
                      <SearchProvider config={data.typesense}>
                        <FilterProvider>
                          <CoverProvider>
                            <ToastProvider>
                              <DiscoverProvider>
                                <ConfirmationProvider>
                                  <MarkAsWatchedDrawerProvider />
                                  <CoverImage />

                                  <ThemeProvider theme={data.theme}>
                                    <ListScrollHistoryProvider>
                                      <!--
                                        All navbars are added in the layout to make sure they can
                                        persist during navigation. The state is set on a page level.
                                      -->
                                      <RenderFor
                                        audience="all"
                                        device={["mobile", "tablet-sm"]}
                                      >
                                        <TopNavbar />
                                      </RenderFor>

                                      <RenderFor
                                        audience="all"
                                        device={["desktop", "tablet-lg"]}
                                      >
                                        <SideNavbar />
                                      </RenderFor>

                                      {@render children()}

                                      <RenderFor
                                        audience="all"
                                        device={["mobile", "tablet-sm"]}
                                      >
                                        <MobileNavbar />
                                      </RenderFor>

                                      <RenderFor audience="authenticated">
                                        <NavbarToastContent />
                                      </RenderFor>
                                      <SvelteQueryDevtools
                                        buttonPosition="bottom-right"
                                        styleNonce="opacity: 0.5"
                                      />
                                    </ListScrollHistoryProvider>
                                  </ThemeProvider>
                                </ConfirmationProvider>
                              </DiscoverProvider>
                            </ToastProvider>
                          </CoverProvider>
                        </FilterProvider>
                      </SearchProvider>
                    </LocaleProvider>
                  </NavigationProvider>

                  {#key page.url.pathname}
                    <PageView />
                  {/key}
                </RedirectProvider>
              </AnalyticsProvider>
            </PlayerProvider>
          </CookieConsentProvider>
        </FeatureFlagProvider>
      </AuthProvider>
    </GlobalParameterProvider>
  </QueryClientProvider>
</ErrorProvider>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.tsqd-open-btn-container) {
    opacity: 0.25;
  }

  @include for-mouse {
    :global(::-webkit-scrollbar) {
      width: var(--ni-8);
      height: var(--ni-8);
    }

    :global(body),
    :global(html) {
      &::-webkit-scrollbar-thumb {
        background-color: var(--cm-color-foreground-30);
      }
    }

    :global(::-webkit-scrollbar-thumb) {
      background-color: transparent;
      border-radius: var(--border-radius-xs);
      opacity: 0;

      backdrop-filter: blur(var(--ni-4));
    }

    :global(:hover::-webkit-scrollbar-thumb) {
      background-color: var(--cm-color-foreground-50);
    }

    :global(::-webkit-scrollbar-thumb:hover) {
      background-color: var(--color-foreground);
    }
  }

  @mixin pwa-navbar-shadow($position) {
    content: "";
    z-index: var(--layer-floating);
    pointer-events: none;

    position: $position;
    top: 0;

    width: 100%;
    height: var(--ni-48);

    background: linear-gradient(
      180deg,
      var(--color-background-navbar-base) 0%,
      var(--color-background-navbar-base) 10%,
      transparent 100%
    );
  }

  :global([data-mobile-os="android"] body.trakt-pwa) {
    &::after {
      @include pwa-navbar-shadow(fixed);
    }
  }

  :global([data-mobile-os="ios"]:has(body.trakt-pwa)),
  :global([data-mobile-os="ios"] body.trakt-pwa) {
    overscroll-behavior-y: none;
  }
</style>
