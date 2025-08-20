<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-comment-footer">
  {@render children()}
</div>

<style>
  .trakt-comment-footer {
    height: var(--ni-40);

    display: flex;
    align-items: center;
    justify-content: space-between;

    :global(.trakt-button) {
      display: flex;
      flex-direction: row-reverse;
      flex-shrink: 1;
    }

    /* To align icons of the ghost buttons */
    margin: var(--ni-neg-12) var(--ni-neg-16);

    &:has(> :global(.trakt-react-button)),
    &:has(> :global(.trakt-react-preview)) {
      margin-bottom: var(--ni-neg-8);
      margin-left: var(--ni-0);
    }
  }
</style>
