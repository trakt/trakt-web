<script lang="ts">
  import { isTextInputTarget } from "$lib/utils/events/isTextInputTarget.ts";
  import { shortcut, type ShortcutTrigger } from "@svelte-put/shortcut";
  import { createSpotlightContext } from "./_internal/createSpotlightContext.ts";
  import SpotlightOverlay from "./_internal/SpotlightOverlay.svelte";

  const { children }: ChildrenProps = $props();

  const { open, toggle } = createSpotlightContext();

  const triggers: ShortcutTrigger[] = [
    {
      key: "/",
      callback: ({ originalEvent }) => {
        if (isTextInputTarget(originalEvent.target)) return;
        originalEvent.preventDefault();
        open();
      },
    },
    {
      key: "k",
      modifier: ["ctrl", "meta"],
      callback: ({ originalEvent }) => {
        originalEvent.preventDefault();
        toggle();
      },
    },
  ];
</script>

<svelte:window use:shortcut={{ trigger: triggers }} />

{@render children()}

<SpotlightOverlay />
