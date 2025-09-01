<script lang="ts">
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import ReactButton from "./ReactButton.svelte";

  const { comment }: { comment: MediaComment } = $props();
</script>

<ReactButton {comment} />
