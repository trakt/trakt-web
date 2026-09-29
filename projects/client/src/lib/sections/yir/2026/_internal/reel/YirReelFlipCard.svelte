<script lang="ts">
  import type { PersonaCardData } from "../cards/PersonaCardData";
  import YirPersonaCard from "../cards/YirPersonaCard.svelte";

  const {
    primary,
    runner,
    faces,
  }: {
    primary: PersonaCardData;
    runner: PersonaCardData | null;
    faces: { front: boolean; back: boolean };
  } = $props();
</script>

{#if runner}
  <div class="yir-reel-flip">
    <div class="yir-reel-face is-front">
      <YirPersonaCard card={runner} live={faces.front} />
    </div>
    <div class="yir-reel-face is-back">
      <YirPersonaCard card={primary} live={faces.back} />
    </div>
  </div>
{:else}
  <YirPersonaCard card={primary} live={faces.back} />
{/if}

<style lang="scss">
  .yir-reel-flip {
    position: relative;
    transform-style: preserve-3d;
    transform: rotateY(var(--rotation));
  }

  .yir-reel-face {
    backface-visibility: hidden;

    &.is-front {
      position: absolute;
      inset: 0;
    }

    &.is-back {
      transform: rotateY(180deg);
    }
  }
</style>
