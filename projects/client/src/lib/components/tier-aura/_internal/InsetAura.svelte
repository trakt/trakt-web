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

    :global([data-member-tier="director"]) & {
      background: var(--aura-director-shimmer);
    }
  }
</style>
