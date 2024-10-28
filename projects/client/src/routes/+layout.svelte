<script lang="ts">
  import { i18n } from "$lib/i18n.ts";
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";
  const { children } = $props();
</script>

<ParaglideJS {i18n}>
  {@render children()}
</ParaglideJS>
