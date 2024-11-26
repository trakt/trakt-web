<script lang="ts">
  import "../style";

  import UserProvider from "$lib/features/auth/components/UserProvider.svelte";
  import { i18n } from "$lib/features/i18n/index.ts";
  import ThemeProvider from "$lib/features/theme/components/ThemeProvider.svelte";
  import Navbar from "$lib/sections/navbar/Navbar.svelte";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";
  import { QueryClientProvider } from "@tanstack/svelte-query";

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
    href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300..700&display=swap"
    rel="stylesheet"
  />
  <style>
    html,
    body {
      margin: 0;
      padding: 0;

      width: 100%;
      height: 100%;
    }

    body {
      background-color: var(--color-background);
      color: var(--color-foreground);
      font-family: "Spline Sans", Arial, sans-serif;
    }
  </style>
</svelte:head>

<ParaglideJS {i18n}>
  <ThemeProvider theme={data.theme}>
    <QueryClientProvider client={data.queryClient}>
      <UserProvider token={data.token}>
        <Navbar />
        {@render children()}
      </UserProvider>
    </QueryClientProvider>
  </ThemeProvider>
</ParaglideJS>
