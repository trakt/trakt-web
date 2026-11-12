<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import TileGrid from "./TileGrid.svelte";
</script>

<div class="trakt-month-review-section-skeleton" aria-hidden="true">
  <div class="head">
    <Skeleton width="var(--ni-120)" height="var(--ni-12)" />
  </div>
  <TileGrid>
    <div class="tile" data-span="4">
      <Skeleton height="100%" radius="var(--border-radius-xl)" />
    </div>
    <div class="tile" data-span="2">
      <Skeleton height="100%" radius="var(--border-radius-xl)" />
    </div>
  </TileGrid>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-section-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .head {
    padding-top: var(--gap-m);
    border-top: 1px solid var(--color-month-review-hairline);
  }

  .tile {
    height: var(--ni-320);

    &[data-span="4"] {
      grid-column: span 4;
    }

    &[data-span="2"] {
      grid-column: span 2;
    }

    @include for-tablet-sm-and-below {
      &[data-span] {
        grid-column: 1 / -1;
      }
    }
  }
</style>
