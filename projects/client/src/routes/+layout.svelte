<script lang="ts">
  import "../style";

  import { page } from "$app/state";
  import CoverImage from "$lib/components/background/CoverImage.svelte";
  import CoverProvider from "$lib/components/background/CoverProvider.svelte";
  import ListScrollHistoryProvider from "$lib/components/section-list/ListScrollHistoryProvider.svelte";
  import AnalyticsProvider from "$lib/features/analytics/AnalyticsProvider.svelte";
  import PageView from "$lib/features/analytics/PageView.svelte";
  import AuthProvider from "$lib/features/auth/components/AuthProvider.svelte";
  import LocaleProvider from "$lib/features/i18n/components/LocaleProvider.svelte";
  import ThemeProvider from "$lib/features/theme/components/ThemeProvider.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Footer from "$lib/sections/footer/Footer.svelte";
  import MobileNavbar from "$lib/sections/navbar/MobileNavbar.svelte";
  import Navbar from "$lib/sections/navbar/Navbar.svelte";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

  const { data, children } = $props();
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

    body {
      background-color: var(--color-background);
      color: var(--color-foreground);
      font-family: "Spline Sans", Arial, sans-serif;
    }
  </style>
</svelte:head>

<QueryClientProvider client={data.queryClient}>
  <AuthProvider isAuthorized={data.auth.isAuthorized} url={data.auth.url}>
    <AnalyticsProvider>
      <LocaleProvider>
        <CoverProvider>
          <CoverImage />

          <ThemeProvider theme={data.theme}>
            <ListScrollHistoryProvider>
              <div class="trakt-layout-wrapper">
                <Navbar />
                <div class="trakt-layout-content">
                  {@render children()}
                </div>
                <Footer />
              </div>
              <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
                <MobileNavbar />
              </RenderFor>
              <SvelteQueryDevtools
                buttonPosition="bottom-left"
                styleNonce="opacity: 0.5"
              />
            </ListScrollHistoryProvider>
          </ThemeProvider>
        </CoverProvider>
      </LocaleProvider>

      {#key page.url.pathname}
        <PageView />
      {/key}
    </AnalyticsProvider>
  </AuthProvider>
</QueryClientProvider>

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
    z-index: 3;
    pointer-events: none;

    position: $position;
    top: 0;

    width: 100%;
    height: var(--ni-48);

    background: linear-gradient(
      0deg,
      transparent 0%,
      color-mix(in srgb, var(--color-background) 2%, transparent 98%) 5%,
      color-mix(in srgb, var(--color-background) 4%, transparent 96%) 9%,
      color-mix(in srgb, var(--color-background) 7%, transparent 93%) 13%,
      color-mix(in srgb, var(--color-background) 10%, transparent 90%) 17%,
      color-mix(in srgb, var(--color-background) 14%, transparent 86%) 20%,
      color-mix(in srgb, var(--color-background) 18%, transparent 82%) 24%,
      color-mix(in srgb, var(--color-background) 23%, transparent 77%) 29%,
      color-mix(in srgb, var(--color-background) 29%, transparent 71%) 34%,
      color-mix(in srgb, var(--color-background) 35%, transparent 65%) 40%,
      color-mix(in srgb, var(--color-background) 43%, transparent 57%) 46%,
      color-mix(in srgb, var(--color-background) 52%, transparent 48%) 54%,
      color-mix(in srgb, var(--color-background) 62%, transparent 38%) 63%,
      color-mix(in srgb, var(--color-background) 73%, transparent 27%) 74%,
      color-mix(in srgb, var(--color-background) 86%, transparent 14%) 86%,
      var(--color-background) 100%
    );
  }

  @include for-pwa {
    :global([data-mobile-os="android"] body) {
      &::after {
        @include pwa-navbar-shadow(fixed);
      }
    }
  }
</style>
