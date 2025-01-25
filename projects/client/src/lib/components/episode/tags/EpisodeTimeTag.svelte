<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const { children }: ChildrenProps = $props();
</script>

<StemTag
  --color-background-stem-tag={"var(--color-background-time-tag)"}
  --color-text-stem-tag={"var(--color-text-time-tag)"}
>
  <p class="show-progress-text meta-info capitalize">
    {@render children()}
  </p>
</StemTag>
