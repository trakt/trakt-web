<script lang="ts">
  import { createSafeMarked } from "$lib/utils/markdown/createSafeMarked.ts";

  const { text }: { text: string } = $props();

  const marked = createSafeMarked();
</script>

<span class="trakt-inline-markdown">
  {@html marked.parseInline(text)}
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-inline-markdown {
    :global(a) {
      @include default-link-style;
    }
  }
</style>
