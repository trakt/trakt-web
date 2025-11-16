<script lang="ts">
  import AnalyticsProvider from "$lib/features/analytics/AnalyticsProvider.svelte";
  import AuthProvider from "$lib/features/auth/components/AuthProvider.svelte";
  import FeatureFlagProvider from "$lib/features/feature-flag/FeatureFlagProvider.svelte";
  import NavigationProvider from "$lib/features/navigation/NavigationProvider.svelte";
  import SearchProvider from "$lib/features/search/SearchProvider.svelte";
  import ToastProvider from "$lib/features/toast/ToastProvider.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import type { Snippet } from "svelte";
  import { isAuthorized } from "./isAuthorized.ts";

  const { children }: { children: Snippet } = $props();
</script>

<!-- TODO: add more providers here as we expand test suite -->
<QueryClientProvider client={new QueryClient()}>
  <AuthProvider isAuthorized={$isAuthorized} isAuthorizedLegacy={false}>
    <FeatureFlagProvider>
      <ToastProvider>
        <SearchProvider
          config={{
            keys: {
              media: "",
              people: "",
            },
            server: "",
          }}
        >
          <NavigationProvider>
            <AnalyticsProvider>
              {@render children()}
            </AnalyticsProvider>
          </NavigationProvider>
        </SearchProvider>
      </ToastProvider>
    </FeatureFlagProvider>
  </AuthProvider>
</QueryClientProvider>
