<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";

  const { src }: { src?: HttpsUrl } = $props();
</script>

<CoverImageSetter {src} type="main" />
