<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useCover } from "./_internal/useCover";

  type ImageBackgroundProps = {
    src: string;
    type: MediaType | "main";
    colors?: [string, string];
  };

  const {
    src,
    type,
    colors = ["var(--color-background)", "var(--color-background)"],
  }: ImageBackgroundProps = $props();

  const { cover, state } = useCover();

  $effect.pre(() => {
    const current = $cover;

    if (current.src === src && $state !== "loading") {
      return;
    }

    cover.set({
      src,
      type,
      colors,
    });

    state.set("change");
    queueMicrotask(() => state.set("ready"));
  });
</script>
