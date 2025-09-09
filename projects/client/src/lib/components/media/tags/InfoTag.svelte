<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { Snippet } from "svelte";

  const { children, icon }: { icon?: Snippet } & ChildrenProps = $props();
</script>

<StemTag {icon}>
  <p class="meta-info capitalize no-wrap">
    {@render children()}
  </p>
</StemTag>
