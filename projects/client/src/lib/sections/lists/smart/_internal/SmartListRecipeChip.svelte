<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { label, isExcluded = false }: {
    label: string;
    isExcluded?: boolean;
  } = $props();
</script>

<li class="trakt-smart-list-recipe-chip" class:is-excluded={isExcluded}>
  <StemTag classList="recipe-chip-tag">
    {#if isExcluded}
      <span class="visually-hidden">{m.text_smart_list_excluded()}</span>
    {/if}
    <span class="tag bold">{label}</span>
  </StemTag>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-recipe-chip {
    display: flex;
    min-width: 0;

    .visually-hidden {
      @include visually-hidden;
    }

    &.is-excluded :global(.recipe-chip-tag .trakt-tag) {
      background: transparent;
      color: var(--color-text-secondary);
      box-shadow: inset 0 0 0 var(--ni-1) var(--color-background-stem-tag);

      text-decoration: line-through;
    }
  }
</style>
