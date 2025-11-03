<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "svelte/store";
  import CollapsableContent from "./CollapsableContent.svelte";

  const { children }: ChildrenProps = $props();

  const labels = {
    view: m.button_text_view_details(),
    hide: m.button_text_hide_details(),
  };

  const isCollapsed = writable(true);
  const toggle = () => {
    isCollapsed.update((v) => !v);
  };
</script>

<CollapsableContent {labels} isCollapsed={$isCollapsed} {toggle}>
  {@render children()}
</CollapsableContent>
