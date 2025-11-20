<script lang="ts">
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";

  const { name, knownFor }: { name: string; knownFor: string | Nil } = $props();
</script>

<div class="trakt-person-title">
  <h2>
    {name}
  </h2>

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
    }
  }

  h2 {
    font-size: var(--font-size-title);

    @include for-tablet-sm-and-below {
      text-align: center;
    }
  }
</style>
