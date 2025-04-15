<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const { children }: ChildrenProps = $props();
</script>

<StemTag>
  <p class="meta-info capitalize no-wrap">
    {@render children()}
  </p>
</StemTag>
