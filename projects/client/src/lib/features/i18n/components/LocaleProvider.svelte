<script lang="ts">
  import { ParaglideJS } from "@inlang/paraglide-sveltekit";
  import { i18n } from "../index";

  const { children }: ChildrenProps = $props();
</script>

<ParaglideJS {i18n}>
  {@render children()}
</ParaglideJS>
