<script lang="ts">
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";
  import type { Snippet } from "svelte";
  import ResponsiveTitle from "./ResponsiveTitle.svelte";

  const {
    name,
    knownFor,
    actions,
  }: { name: string; knownFor: string | Nil; actions?: Snippet } = $props();
</script>

<div class="trakt-person-title">
  {#if actions}
    <div class="person-title-row">
      <ResponsiveTitle title={name} />
      {@render actions()}
    </div>
  {:else}
    <ResponsiveTitle title={name} />
  {/if}

  {#if knownFor}
    <p class="secondary">
      {toTranslatedPosition(knownFor)}
    </p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-person-title {
    display: flex;
    flex-direction: column;

    .person-title-row {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      :global(.trakt-action-button svg) {
        width: var(--ni-24);
        height: var(--ni-24);
      }
    }

    @include for-tablet-sm-and-below {
      align-items: center;

      :global(.trakt-responsive-title) {
        text-align: center;
      }
    }
  }
</style>
