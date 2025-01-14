<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  type ShowProgressTagProps = {
    total: number;
    progress: number;
  } & ChildrenProps;

  const { children, total, progress }: ShowProgressTagProps = $props();
  const percentage = $derived((progress / total) * 100);
</script>

<div class="show-progress-tag" style:--progress-width={`${percentage}%`}>
  <TagContent>
    <p class="meta-info capitalize">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .show-progress-tag {
    width: 100%;
  }

  .show-progress-tag {
    :global(.trakt-tag) {
      overflow: hidden;

      &::before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        border-radius: inherit;

        width: var(--progress-width);
        background-color: var(--color-background-progress-tag);

        transition: width var(--transition-increment) ease-in;
      }

      width: 100%;
      position: relative;
      background: var(--color-background-progress-base-tag);
      color: var(--color-text-progress-tag);
    }
  }
</style>
