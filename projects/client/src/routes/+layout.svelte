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
  import FeatureFlagProvider from "$lib/features/feature-flag/FeatureFlagProvider.svelte";
  import FilterProvider from "$lib/features/filters/FilterProvider.svelte";
  import LocaleProvider from "$lib/features/i18n/components/LocaleProvider.svelte";
  import NavigationProvider from "$lib/features/navigation/NavigationProvider.svelte";
  import GlobalParameterProvider from "$lib/features/parameters/GlobalParameterProvider.svelte";
  import QueryClientProvider from "$lib/features/query/QueryClientProvider.svelte";
  import SearchProvider from "$lib/features/search/SearchProvider.svelte";
  import ThemeProvider from "$lib/features/theme/components/ThemeProvider.svelte";
  import ToastProvider from "$lib/features/toast/ToastProvider.svelte";
  import WSInvalidator from "$lib/features/websocket/WSInvalidator.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Footer from "$lib/sections/footer/Footer.svelte";
  import MobileNavbar from "$lib/sections/navbar/MobileNavbar.svelte";
  import Navbar from "$lib/sections/navbar/Navbar.svelte";
  import Toast from "$lib/sections/toast/Toast.svelte";
  import { isPWA } from "$lib/utils/devices/isPWA.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { WorkerMessage } from "$worker/WorkerMessage";
  import { workerRequest } from "$worker/workerRequest";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { onMount } from "svelte";

  const { data, children } = $props();

  const isOnHomePage = $derived(UrlBuilder.home() === page.url.pathname);

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
  </style>

  {#if data.device === "tv"}
    <script src="/webostv.js" charset="utf-8"></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/core-js/3.41.0/minified.js"
      integrity="sha512-f3bL1m/4b2hewJR1QPHqe1xtK1ch1+p3j/jhWkLbZxG4X8/KPhy4+ynauKz0AwPRITB0qXVVyna23/uKe8B4Ww=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>

    <style>
      /* To override the style that webOS inserts */
      * {
        font-family: "Spline Sans", Arial, sans-serif !important;
      }
    </style>
  {/if}
</svelte:head>

<ErrorProvider>
  <QueryClientProvider client={data.queryClient} device={data.device}>
    <GlobalParameterProvider>
      <AuthProvider
        isAuthorizedLegacy={data.auth.isAuthorized}
        isAuthorized={data.oidcAuth.isAuthorized}
      >
        <WSInvalidator />
        <CookieConsentProvider
          hasConsent={data.hasConsent || data.device === "tv"}
          device={data.device}
        >
          <AnalyticsProvider>
            <AutoSigninProvider>
              <NavigationProvider device={data.device}>
                <LocaleProvider>
                  <SearchProvider config={data.typesense}>
                    <FilterProvider>
                      <FeatureFlagProvider>
                        <CoverProvider>
                          <ToastProvider>
                            <CoverImage />

                            <ThemeProvider theme={data.theme}>
                              <ListScrollHistoryProvider>
                                <div class="trakt-layout-wrapper">
                                  <RenderFor audience="authenticated">
                                    <Navbar />
                                  </RenderFor>
                                  <RenderFor audience="public">
                                    {#if !isOnHomePage}
                                      <Navbar />
                                    {/if}
                                  </RenderFor>
                                  <div class="trakt-layout-content">
                                    {@render children()}
                                  </div>
                                  <RenderFor
                                    audience="authenticated"
                                    navigation="default"
                                  >
                                    <Footer />
                                  </RenderFor>
                                  <RenderFor
                                    audience="public"
                                    navigation="default"
                                  >
                                    {#if !isOnHomePage}
                                      <Footer />
                                    {/if}
                                  </RenderFor>
                                </div>
                                <RenderFor
                                  audience="authenticated"
                                  device={["mobile", "tablet-sm"]}
                                >
                                  <MobileNavbar />
                                </RenderFor>
                                <RenderFor
                                  audience="public"
                                  device={["mobile", "tablet-sm"]}
                                >
                                  {#if !isOnHomePage}
                                    <MobileNavbar />
                                  {/if}
                                </RenderFor>
                                <RenderFor
                                  audience="authenticated"
                                  navigation="default"
                                >
                                  <Toast />
                                </RenderFor>
                                <SvelteQueryDevtools
                                  buttonPosition="bottom-right"
                                  styleNonce="opacity: 0.5"
                                />
                              </ListScrollHistoryProvider>
                            </ThemeProvider>
                          </ToastProvider>
                        </CoverProvider>
                      </FeatureFlagProvider>
                    </FilterProvider>
                  </SearchProvider>
                </LocaleProvider>
              </NavigationProvider>

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

    padding-left: var(--layout-sidebar-distance);
    box-sizing: border-box;
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
