<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import { useCollapsedSection } from "$lib/stores/useCollapsedSection";
  import CollapsableContent from "./CollapsableContent.svelte";

  const STORAGE_KEY = "summary_details_collapsed";

  const { children, type }: { type: ExtendedMediaType } & ChildrenProps =
    $props();

  const labels = {
    view: m.button_text_view_details(),
    hide: m.button_text_hide_details(),
  };

  const { isCollapsed, toggle } = $derived(
    useCollapsedSection(`${type}_${STORAGE_KEY}`, true),
  );
</script>

<CollapsableContent {labels} isCollapsed={$isCollapsed} {toggle}>
  {@render children()}
</CollapsableContent>
