<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CollapsableContent from "./CollapsableContent.svelte";

  const { children }: ChildrenProps = $props();

  const labels = {
    view: m.button_text_view_details(),
    hide: m.button_text_hide_details(),
  };
</script>

<CollapsableContent {labels}>
  {@render children()}
</CollapsableContent>
