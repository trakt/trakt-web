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

<style>
  .rating-item {
    display: flex;

    align-items: center;
    gap: var(--gap-xxs);
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
