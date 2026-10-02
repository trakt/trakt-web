<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";

  const {
    title,
    style = "action",
    variant,
  }: {
    title: string;
    style?: "action" | "dropdown-item";
    variant?: "primary" | "secondary";
  } = $props();
</script>

<ShareButton
  {title}
  {style}
  {variant}
  source={{ id: "episode" }}
/>
