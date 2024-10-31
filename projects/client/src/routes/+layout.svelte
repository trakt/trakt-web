<script lang="ts">
  import "../theme.css";
  import "../app.css";

  import { i18n } from "$lib/features/i18n/index.ts";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";
  const { children } = $props();
</script>

<ParaglideJS {i18n}>
  {@render children()}
</ParaglideJS>
