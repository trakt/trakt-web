<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useCover } from "./_internal/useCover";

  type ImageBackgroundProps = {
    src?: string | Nil;
    type: MediaType | "main";
    colors?: [string, string];
  };

  const {
    src,
    type,
    colors = ["var(--color-background)", "var(--color-background)"],
  }: ImageBackgroundProps = $props();

  const { cover } = useCover();

  $effect.pre(() => {
    if (!src) {
      cover.set({
        data: undefined,
        state: "no-cover",
      });
      return;
    }

    const current = $cover;
    if (
      current.state !== "no-cover" &&
      current.state !== "loading" &&
      current.data.src === src
    ) {
      return;
    }

    const data = {
      src,
      type,
      colors,
    };

    cover.set({
      data,
      state: "change",
    });

    queueMicrotask(() => cover.set({ data, state: "ready" }));
  });
</script>
