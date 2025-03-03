<script lang="ts">
  import AnalyticsProvider from "$lib/features/analytics/AnalyticsProvider.svelte";
  import AuthProvider from "$lib/features/auth/components/AuthProvider.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import type { Snippet } from "svelte";
  import { isAuthorized } from "./isAuthorized.ts";

  const { children }: { children: Snippet } = $props();
</script>

<!-- TODO: add more providers here as we expand test suite -->
<AuthProvider isAuthorized={$isAuthorized} url="http://localhost:3000">
  <QueryClientProvider client={new QueryClient()}>
    <AnalyticsProvider>
      {@render children()}
    </AnalyticsProvider>
  </QueryClientProvider>
</AuthProvider>
