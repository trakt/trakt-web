<script lang="ts">
  import "../style";

  import AuthGuard from "$lib/features/auth/components/AuthGuard.svelte";
  import { i18n } from "$lib/features/i18n/index.ts";
  import Navbar from "$lib/sections/navbar/Navbar.svelte";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";

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
  <AuthGuard token={data.token}>
    <Navbar theme={data.theme} />
    {@render children()}
  </AuthGuard>
</ParaglideJS>
