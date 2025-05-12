<script lang="ts">
  import "../style";

  import { page } from "$app/state";
  import CoverImage from "$lib/components/background/CoverImage.svelte";
  import CoverProvider from "$lib/components/background/CoverProvider.svelte";
  import ListScrollHistoryProvider from "$lib/components/lists/section-list/ListScrollHistoryProvider.svelte";
  import AnalyticsProvider from "$lib/features/analytics/AnalyticsProvider.svelte";
  import PageView from "$lib/features/analytics/PageView.svelte";
  import AuthProvider from "$lib/features/auth/components/AuthProvider.svelte";
  import AutoSigninProvider from "$lib/features/auto-signin/AutoSigninProvider.svelte";
  import CookieConsentProvider from "$lib/features/cookie-consent/CookieConsentProvider.svelte";
  import { DeploymentEndpoint } from "$lib/features/deployment/DeploymentEndpoint.js";
  import ErrorProvider from "$lib/features/errors/ErrorProvider.svelte";
  import FilterProvider from "$lib/features/filters/FilterProvider.svelte";
  import LocaleProvider from "$lib/features/i18n/components/LocaleProvider.svelte";
  import NavigationProvider from "$lib/features/navigation/NavigationProvider.svelte";
  import GlobalParameterProvider from "$lib/features/parameters/GlobalParameterProvider.svelte";
  import QueryClientProvider from "$lib/features/query/QueryClientProvider.svelte";
  import SearchProvider from "$lib/features/search/SearchProvider.svelte";
  import ThemeProvider from "$lib/features/theme/components/ThemeProvider.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Footer from "$lib/sections/footer/Footer.svelte";
  import MobileNavbar from "$lib/sections/navbar/MobileNavbar.svelte";
  import Navbar from "$lib/sections/navbar/Navbar.svelte";
  import SideNavbar from "$lib/sections/navbar/SideNavbar.svelte";
  import NowPlaying from "$lib/sections/now-playing/NowPlaying.svelte";
  import { isPWA } from "$lib/utils/devices/isPWA.ts";
  import { WorkerMessage } from "$worker/WorkerMessage";
  import { workerRequest } from "$worker/workerRequest";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { onMount } from "svelte";

  const { data, children } = $props();

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
  <title>Trakt Lite</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    rel="preconnect"
    href="https://walter-r2.trakt.tv"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300..700&display=swap"
    rel="stylesheet"
  />
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
      font-family: "Spline Sans", Arial, sans-serif;
    }

    body:has(dialog[open]),
    body.dialog-open {
      overflow: hidden;
    }

    body:has(.trakt-side-navbar) {
      --layout-distance-side: calc(var(--ni-36) + var(--side-navbar-width));
    }
  </style>
</svelte:head>

<ErrorProvider>
  <QueryClientProvider client={data.queryClient} device={data.device}>
    <GlobalParameterProvider>
      <AuthProvider isAuthorized={data.auth.isAuthorized} url={data.auth.url}>
        <CookieConsentProvider
          hasConsent={data.hasConsent}
          device={data.device}
        >
          <AnalyticsProvider>
            <AutoSigninProvider>
              <LocaleProvider>
                <NavigationProvider device={data.device}>
                  <!-- TODO: coalesce this when we add support for people 'n stuff -->
                  <SearchProvider type="show">
                    <SearchProvider type="movie">
                      <FilterProvider>
                        <CoverProvider>
                          <CoverImage />

                          <ThemeProvider theme={data.theme}>
                            <ListScrollHistoryProvider>
                              <div class="trakt-layout-wrapper">
                                <RenderFor audience="all" navigation="default">
                                  <Navbar />
                                </RenderFor>
                                <RenderFor audience="all" navigation="dpad">
                                  <SideNavbar />
                                </RenderFor>
                                <div class="trakt-layout-content">
                                  {@render children()}
                                </div>
                                <RenderFor audience="all" navigation="default">
                                  <Footer />
                                </RenderFor>
                              </div>
                              <RenderFor
                                audience="all"
                                device={["mobile", "tablet-sm"]}
                                navigation="default"
                              >
                                <MobileNavbar />
                              </RenderFor>
                              <RenderFor
                                audience="authenticated"
                                navigation="default"
                              >
                                <NowPlaying />
                              </RenderFor>
                              <SvelteQueryDevtools
                                buttonPosition="bottom-left"
                                styleNonce="opacity: 0.5"
                              />
                            </ListScrollHistoryProvider>
                          </ThemeProvider>
                        </CoverProvider>
                      </FilterProvider>
                    </SearchProvider>
                  </SearchProvider>
                </NavigationProvider>
              </LocaleProvider>

              {#key page.url.pathname}
                <PageView />
              {/key}
            </AutoSigninProvider>
          </AnalyticsProvider>
        </CookieConsentProvider>
      </AuthProvider>
    </GlobalParameterProvider>
  </QueryClientProvider>
</ErrorProvider>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.tsqd-open-btn-container) {
    opacity: 0.25;
  }

  .trakt-layout-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .trakt-layout-content {
    flex: 1;
  }

  @include for-mouse {
    :global(::-webkit-scrollbar) {
      width: var(--ni-8);
      height: var(--ni-8);
    }

    :global(body),
    :global(html) {
      &::-webkit-scrollbar-thumb {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 30%,
          transparent 70%
        );
      }
    }

    :global(::-webkit-scrollbar-thumb) {
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 0%,
        transparent 100%
      );
      border-radius: var(--border-radius-xs);
      backdrop-filter: blur(var(--ni-4));
      opacity: 0;
    }

    :global(:hover::-webkit-scrollbar-thumb) {
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 50%,
        transparent 50%
      );
    }

    :global(::-webkit-scrollbar-thumb:hover) {
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 100%,
        transparent 0%
      );
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
</style>
