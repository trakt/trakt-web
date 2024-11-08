<script lang="ts">
  import "../theme.css";
  import "../dimensions.css";
  import "../app.css";

  import { i18n } from "$lib/features/i18n/index.ts";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";
  import Navbar from "$lib/features/navbar/Navbar.svelte";

  const { data, children } = $props();
</script>

<ParaglideJS {i18n}>
  <Navbar theme={data.theme} />
  {@render children()}
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
