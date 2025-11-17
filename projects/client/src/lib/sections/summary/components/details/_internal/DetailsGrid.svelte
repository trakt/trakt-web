<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import MoreButton from "$lib/components/buttons/more/MoreButton.svelte";
  import { MoreButtonIntlProvider } from "$lib/components/buttons/more/MoreButtonIntlProvider";
  import { writable } from "svelte/store";

  type DetailsGridProps = {
    title?: string;
    isCollapsable?: boolean;
  } & ChildrenProps;

  const { title, children, isCollapsable = false }: DetailsGridProps = $props();

  const expanded = writable(!isCollapsable);
</script>

<div class="trakt-summary-details-grid">
  {#if title}
    <div class="trakt-summary-details-grid-header">
      <h5>{title}</h5>
      {#if isCollapsable}
        <MoreButton
          i18n={MoreButtonIntlProvider}
          label="{m.button_label_expand_category({ category: title })}}"
          count={undefined}
          onExpand={() => expanded.set(true)}
          onCollapse={() => expanded.set(false)}
        />
      {/if}
    </div>
  {/if}
  <div class="trakt-summary-details-grid-content" class:is-hidden={!$expanded}>
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-details-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    @include for-mobile {
      gap: var(--gap-s);
    }
  }

  .trakt-summary-details-grid-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    h5 {
      //To result in a visual alignment that works better
      margin-top: var(--ni-neg-2);

      transition: font-size calc(var(--transition-increment) * 2) ease-in-out;
    }
  }

  .trakt-summary-details-grid-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-m);

    &.is-hidden {
      display: none;
    }

    @include for-mobile {
      gap: var(--gap-s);
    }
  }
</style>
