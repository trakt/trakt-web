<script lang="ts">
  import DropButton from "./DropButton.svelte";
  import { useDrop, type DropStoreProps } from "./useDrop";

  type DropActionProps = {
    style: "normal" | "action" | "dropdown-item";
    size?: "normal" | "small";
    variant?: "primary" | "secondary";
  } & DropStoreProps;

  const {
    style = "action",
    size = "normal",
    variant,
    title,
    ...target
  }: DropActionProps = $props();

  const { drop, isDropping } = $derived(
    useDrop({
      ...target,
      title,
    }),
  );
</script>

<DropButton
  {style}
  {title}
  {size}
  {variant}
  type={target.type}
  isDropping={$isDropping}
  onDrop={drop}
/>
