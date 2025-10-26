<script lang="ts">
  import RestoreButton from "./RestoreButton.svelte";
  import { useRestore } from "./useRestore";

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

  const { restore, isRestoring } = $derived(
    useRestore({
      ids: [target.id],
      title,
    }),
  );
</script>

<RestoreButton
  {style}
  {title}
  {size}
  isRestoring={$isRestoring}
  onRestore={restore}
/>
