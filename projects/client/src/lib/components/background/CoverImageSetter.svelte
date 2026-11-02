<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { onDestroy } from "svelte";
  import { useCover } from "./_internal/useCover";

  type ImageBackgroundProps = {
    src?: string | Nil;
    type: MediaType | "main";
    colors?: [string, string];
    resetOnDestroy?: boolean;
  };

  const {
    src,
    type,
    colors = ["var(--color-background)", "var(--color-background)"],
    resetOnDestroy = false,
  }: ImageBackgroundProps = $props();

  const { cover } = useCover();

  $effect.pre(() => {
    if (!src) {
      cover.next({
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

    cover.next({
      data,
      state: "change",
    });

    queueMicrotask(() => cover.next({ data, state: "ready" }));
  });

  onDestroy(() => {
    if (!resetOnDestroy) return;

    const current = cover.getValue();
    if (current.state === "no-cover" || current.data.src !== src) return;

    cover.next({ data: undefined, state: "no-cover" });
  });
</script>
