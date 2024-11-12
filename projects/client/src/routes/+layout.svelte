<script lang="ts">
  import "../theme.css";
  import "../dimensions.css";
  import "../app.css";

  import { i18n } from "$lib/features/i18n/index.ts";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";
  import Navbar from "$lib/sections/navbar/Navbar.svelte";
  import AuthGuard from "$lib/features/auth/components/AuthGuard.svelte";

  const { data, children } = $props();
</script>

<ParaglideJS {i18n}>
  <AuthGuard token={data.token}>
    <Navbar theme={data.theme} />
    {@render children()}
  </AuthGuard>
</ParaglideJS>
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
</svelte:head>
