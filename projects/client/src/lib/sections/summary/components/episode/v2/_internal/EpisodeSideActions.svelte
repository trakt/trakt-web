<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";

  const {
    title,
    style = "action",
  }: {
    title: string;
    style?: "action" | "dropdown-item";
  } = $props();
</script>

<ShareButton
  {title}
  {style}
  source={{ id: "episode" }}
/>
