<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-tag">
  {@render children()}
</div>

<style>
  .trakt-tag {
    font-size: 0.625rem;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.025rem;

    height: 0.85rem;
    line-height: 0.85rem;
    margin: 0;
    padding: 0.125rem 0.5rem;

    border-radius: 1.125rem;
  }
</style>
