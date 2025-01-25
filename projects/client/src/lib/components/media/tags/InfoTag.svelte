<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const { children }: ChildrenProps = $props();
</script>

<StemTag
  --color-background-stem-tag="var(--color-background-info-tag)"
  --color-text-stem-tag="var(--color-text-info-tag)"
>
  <p class="meta-info capitalize no-wrap">
    {@render children()}
  </p>
</StemTag>
