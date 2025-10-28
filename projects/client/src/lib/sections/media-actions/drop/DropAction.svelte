<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DropButton from "./DropButton.svelte";
  import { useDrop } from "./useDrop";

  type DropActionProps = {
    style: "normal" | "action" | "dropdown-item";
    title: string;
    size?: "normal" | "small";
    id: number;
    type: MediaType;
  };

  const {
    style = "action",
    size = "normal",
    title,
    type,
    ...target
  }: DropActionProps = $props();

  const { drop, isDropping } = $derived(
    useDrop({
      id: target.id,
      type,
    }),
  );
</script>

<DropButton
  {style}
  {title}
  {size}
  {type}
  isDropping={$isDropping}
  onDrop={drop}
/>
