<script lang="ts">
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";
  import ResponsiveTitle from "./ResponsiveTitle.svelte";

  const { name, knownFor }: { name: string; knownFor: string | Nil } = $props();
</script>

<div class="trakt-person-title">
  <ResponsiveTitle title={name} />

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

    @include for-tablet-sm-and-below {
      align-items: center;

      :global(.trakt-responsive-title) {
        text-align: center;
      }
    }
  }
</style>
