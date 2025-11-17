<script lang="ts">
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";

  const { name, knownFor }: { name: string; knownFor: string | Nil } = $props();
</script>

<div class="trakt-person-title">
  <h2 class:short-title={name.length < 15} class:long-title={name.length > 25}>
    {name}
  </h2>

  {#if knownFor}
    <p class="secondary">
      {toTranslatedPosition(knownFor)}
    </p>
  {/if}
</div>

<style>
  .trakt-person-title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-32));
    text-align: center;
  }
</style>
