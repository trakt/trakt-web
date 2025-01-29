<script lang="ts" generics="T extends { id: unknown }">
  import { type Snippet } from "svelte";

  type RatingItemProps = {
    rating: Snippet;
    superscript: Snippet;
    voteCount: number;
  } & ChildrenProps;

  const { children, rating, superscript, voteCount }: RatingItemProps =
    $props();
</script>

<div class="rating-item">
  {@render children()}
  <div class="rating-info">
    <p class="large bold">
      {#if voteCount === 0}
        -
      {:else}
        {@render rating()}
      {/if}
    </p>
    {#if voteCount > 0}
      <p class="small bold uppercase secondary">
        {@render superscript()}
      </p>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .rating-item {
    display: flex;

    align-items: center;
    gap: var(--gap-xxs);

    p {
      transition: font-size calc(var(--transition-increment) * 2) ease-in-out;
    }

    :global(svg) {
      transition: calc(var(--transition-increment) * 2) ease-in-out;
      transition-property: width, height;
    }

    @include for-mobile {
      :global(svg) {
        height: var(--ni-12);
        width: auto;
      }

      p.large {
        font-size: var(--ni-12);
      }

      p.small {
        font-size: var(--ni-10);
      }
    }
  }

  .rating-info {
    display: flex;
    align-items: start;
    gap: var(--gap-xxs);

    p {
      line-height: 90%;
    }
  }
</style>
