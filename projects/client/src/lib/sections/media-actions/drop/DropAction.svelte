<script lang="ts">
  import DropButton from "./DropButton.svelte";
  import { useDrop } from "./useDrop";

  type DropActionProps = {
    style: "normal" | "action" | "dropdown-item";
    title: string;
    size?: "normal" | "small";
    id: number;
  };

  const {
    style = "action",
    size = "normal",
    title,
    ...target
  }: DropActionProps = $props();

  const { drop, isDropping } = $derived(
    useDrop({
      ids: [target.id],
      title,
    }),
  );
</script>

<DropButton {style} {title} {size} isDropping={$isDropping} onDrop={drop} />
