<script lang="ts">
  import type { TagType } from "$lib/components/media/tags/models/TagType";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { Snippet } from "svelte";

  type TagByTypeProps = ChildrenProps & {
    type?: TagType;
    icon?: Snippet;
  };

  const { children, type = "text", icon }: TagByTypeProps = $props();
</script>

{#if type === "text"}
  <TextTag {icon}>
    {@render children()}
  </TextTag>
{:else}
  <StemTag {icon}>
    {@render children()}
  </StemTag>
{/if}
