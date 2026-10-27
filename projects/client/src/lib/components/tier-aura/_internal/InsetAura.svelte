<!--
  For avatars too small or too crowded for a setting, like overlapping
  stacks: the tier's band is drawn just inside the face's edge instead.
-->
<span class="inset-band"></span>

<style lang="scss">
  @use "./aura" as *;

  .inset-band {
    position: absolute;
    inset: var(--tier-aura-inset-gap, 0);
    border-radius: 50%;
    pointer-events: none;
    background: var(--aura-facets);
    @include ring-mask(var(--ni-2));

    :global([data-tier="director"]) & {
      background: var(--aura-director-fire);
    }
  }
</style>
