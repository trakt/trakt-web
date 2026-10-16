<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartListTemplate } from "$lib/requests/models/SmartListTemplate.ts";
  import SmartListTemplateCard from "./_internal/SmartListTemplateCard.svelte";

  const {
    templates,
    onHide,
  }: { templates: SmartListTemplate[]; onHide: () => void } = $props();
</script>

<div class="trakt-smart-list-templates">
  <div class="templates-intro">
    <p class="secondary">{m.smart_list_templates_intro()}</p>

    <button
      type="button"
      class="templates-hide-button"
      aria-label={m.button_label_hide_smart_list_templates()}
      onclick={onHide}
    >
      {m.button_text_hide()}
    </button>
  </div>

  <SectionList
    id={{ scope: "smart-list-templates" }}
    title={null}
    items={templates}
    --height-list="calc(var(--height-smart-list-template-card) + var(--layout-scrollbar-width) + var(--layout-footer-less-padding))"
  >
    {#snippet item(template)}
      <SmartListTemplateCard {template} />
    {/snippet}
  </SectionList>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-templates {
    --height-smart-list-template-card: var(--ni-204);

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .templates-intro {
    margin-inline: var(--layout-distance-side);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    min-width: 0;

    p {
      flex: 1;
      min-width: 0;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .templates-hide-button {
    flex: none;

    min-height: var(--ni-40);
    padding-inline: var(--gap-s);

    border: none;
    border-radius: var(--border-radius-m);
    background: transparent;

    color: var(--color-text-secondary);
    font: inherit;
    font-size: var(--font-size-text-small);
    font-weight: 600;
    cursor: pointer;

    transition: color var(--transition-increment) ease-in-out;

    @include for-mobile {
      min-height: var(--ni-44);
    }

    @include for-mouse {
      &:hover {
        color: var(--color-text-primary);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid
        var(--color-background-button-outline);
      outline-offset: var(--ni-2);
    }
  }
</style>
