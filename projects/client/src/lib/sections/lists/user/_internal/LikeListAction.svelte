<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LikeIcon from "$lib/components/icons/LikeIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";

  const {
    onToggle,
    isUpdating,
    state,
    list,
  }: {
    onToggle: () => void;
    isUpdating: boolean;
    state: "liked" | "unliked";
    list: MediaListSummary;
  } = $props();

  const label = $derived(
    state === "liked"
      ? m.button_label_unlike_list({ name: list.name })
      : m.button_label_like_list({ name: list.name }),
  );
</script>

<trakt-list-like-action>
  <Button {label} style="ghost" onclick={onToggle} disabled={isUpdating}>
    {toHumanNumber(list.likeCount, languageTag())}
    {#snippet icon()}
      <LikeIcon style={state === "liked" ? "filled" : "open"} />
    {/snippet}
  </Button>
</trakt-list-like-action>

<style>
  trakt-list-like-action {
    :global(.trakt-button) {
      gap: var(--gap-xs);
      flex-direction: row-reverse;
    }
  }
</style>
