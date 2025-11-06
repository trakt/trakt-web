<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  const { src: externalSrc }: { src?: HttpsUrl } = $props();

  const { user } = useUser();
</script>

<RenderFor audience="authenticated">
  <CoverImageSetter src={externalSrc ?? $user.cover.url} type="main" />
</RenderFor>

<RenderFor audience="public">
  <CoverImageSetter type="main" />
</RenderFor>
