<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  type ProgressTagProps = {
    progress: number;
    total?: number;
  } & ChildrenProps;

  const { children, progress, total = 100 }: ProgressTagProps = $props();
</script>

<div
  class="progress-tag"
  style:--progress-width={`${progress}%`}
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

  .progress-tag {
    width: 100%;
    min-width: 0;

    :global(.trakt-tag) {
      --progress-bar-spacing: var(--ni-6);
      --progress-bar-offset: calc(var(--progress-bar-spacing) / 2);
      overflow: hidden;
      padding: var(--ni-4) var(--ni-10);

      &::before {
        content: "";
        display: block;
        position: absolute;
        left: var(--progress-bar-offset);
        top: var(--progress-bar-offset);
        width: calc(100% - var(--progress-bar-spacing));
        height: calc(100% - var(--progress-bar-spacing));

        border-radius: inherit;

        width: calc(var(--progress-width) - var(--progress-bar-offset));
        background-color: var(--color-background-progress-tag);

        transition: width var(--transition-increment) ease-in;
      }

      position: relative;
      background: var(--color-background-cover-tag);
      color: var(--color-text-progress-tag);
    }
  }
</style>
