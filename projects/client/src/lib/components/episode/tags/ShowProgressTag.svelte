<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import { stretchedPercentage } from "$lib/utils/number/stretchedPercentage";

  type ShowProgressTagProps = {
    total: number;
    progress: number;
  } & ChildrenProps;

  const { children, total, progress }: ShowProgressTagProps = $props();
  const percentage = $derived(stretchedPercentage({ value: progress, total }));
</script>

<div
  class="show-progress-tag"
  style:--progress-width={`${percentage}%`}
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={total}
>
  <TagContent>
    <p class="meta-info capitalize tag-label">
      {@render children()}
    </p>
  </TagContent>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .tag-label {
    width: 100%;
  }

  .show-progress-tag {
    width: 100%;
    min-width: 0;

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

      position: relative;
      background: var(--color-background-cover-tag);
      color: var(--color-text-progress-tag);
    }
  }
</style>
