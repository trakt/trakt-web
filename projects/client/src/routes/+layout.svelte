<script lang="ts">
  import "../style";

  import { page } from "$app/stores";
  import AnalyticsProvider from "$lib/features/analytics/AnalyticsProvider.svelte";
  import PageView from "$lib/features/analytics/PageView.svelte";
  import AuthProvider from "$lib/features/auth/components/AuthProvider.svelte";
  import LocaleProvider from "$lib/features/i18n/components/LocaleProvider.svelte";
  import ThemeProvider from "$lib/features/theme/components/ThemeProvider.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Footer from "$lib/sections/footer/Footer.svelte";
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

    @media (hover: hover) and (pointer: fine) {
      ::-webkit-scrollbar {
        width: var(--ni-8);
        height: var(--ni-8);
      }

      body,
      html {
        &::-webkit-scrollbar-thumb {
          background-color: color-mix(
            in srgb,
            var(--color-foreground) 30%,
            transparent 70%
          );
        }
      }

      ::-webkit-scrollbar-thumb {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 0%,
          transparent 100%
        );
        border-radius: var(--ni-4);
        backdrop-filter: blur(var(--ni-4));
        opacity: 0;
      }

      :hover::-webkit-scrollbar-thumb {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 50%,
          transparent 50%
        );
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 100%,
          transparent 0%
        );
      }
    }
  </style>
</svelte:head>

<QueryClientProvider client={data.queryClient}>
  <AuthProvider token={data.token}>
    <AnalyticsProvider>
      <LocaleProvider>
        <ThemeProvider theme={data.theme}>
          <div class="trakt-layout-wrapper">
            <Navbar />
            <div class="trakt-layout-content">
              {@render children()}
            </div>
            <RenderFor device={["tablet-lg", "desktop"]} audience="all">
              <Footer />
            </RenderFor>
          </div>

          <SvelteQueryDevtools
            buttonPosition="bottom-left"
            styleNonce="opacity: 0.5"
          />
        </ThemeProvider>
      </LocaleProvider>

      {#key $page.url.pathname}
        <PageView />
      {/key}
    </AnalyticsProvider>
  </AuthProvider>
</QueryClientProvider>

<style>
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
</style>
