<script lang="ts">
  import "../app.css";
  import "../style";

  import AuthGuard from "$lib/features/auth/components/AuthGuard.svelte";
  import { i18n } from "$lib/features/i18n/index.ts";
  import Navbar from "$lib/sections/navbar/Navbar.svelte";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";

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
