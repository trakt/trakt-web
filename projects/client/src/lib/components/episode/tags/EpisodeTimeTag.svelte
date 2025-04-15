<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const { children }: ChildrenProps = $props();
</script>

<StemTag>
  <p class="show-progress-text meta-info capitalize">
    {@render children()}
  </p>
</StemTag>
