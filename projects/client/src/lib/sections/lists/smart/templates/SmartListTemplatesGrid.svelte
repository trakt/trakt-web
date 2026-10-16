<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartListTemplate } from "$lib/requests/models/SmartListTemplate.ts";
  import { scrollToHashOnce } from "$lib/utils/actions/scrollToHashOnce.ts";
  import { SMART_LIST_TEMPLATES_ANCHOR } from "$lib/utils/constants.ts";
  import SmartListTemplateCard from "./_internal/SmartListTemplateCard.svelte";

  const { templates, isReady }: {
    templates: SmartListTemplate[];
    isReady: boolean;
  } = $props();
</script>

{#if templates.length > 0}
  <div
    id={SMART_LIST_TEMPLATES_ANCHOR}
    class="trakt-smart-list-templates-grid"
    use:scrollToHashOnce={{ ready: isReady }}
  >
    <GridList
      id="smart-list-templates-grid"
      title={m.list_title_smart_list_templates()}
      items={templates}
      sizing="auto"
      --width-item="min(var(--width-list-card), 100%)"
    >
      {#snippet item(template)}
        <SmartListTemplateCard {template} />
      {/snippet}
    </GridList>
  </div>
{/if}

<style>
  .trakt-smart-list-templates-grid {
    --height-smart-list-template-card: var(--ni-204);

    scroll-margin-top: var(--navbar-height);
  }
</style>
