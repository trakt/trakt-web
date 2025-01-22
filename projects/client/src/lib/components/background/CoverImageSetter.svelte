<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useCover } from "./_internal/useCover";

  type ImageBackgroundProps = {
    src: string;
    type: MediaType | "main";
  };

  const { src, type }: ImageBackgroundProps = $props();

  const { cover, state } = useCover();

  $effect.pre(() => {
    const current = $cover;

    if (current.src === src && $state !== "loading") {
      return;
    }

    cover.set({
      src,
      type,
    });

    state.set("change");
    queueMicrotask(() => state.set("ready"));
  });
</script>
