<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import LikeIcon from "$lib/components/icons/LikeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    onToggle,
    isUpdating,
    state,
    name,
  }: {
    onToggle: () => void;
    isUpdating: boolean;
    state: "liked" | "unliked";
    name: string;
  } = $props();

  const label = $derived(
    state === "liked"
      ? m.button_label_unlike_list({ name })
      : m.button_label_like_list({ name }),
  );
</script>

<ActionButton
  {label}
  style="ghost"
  onclick={onToggle}
  size="small"
  disabled={isUpdating}
>
  <LikeIcon style={state === "liked" ? "filled" : "open"} />
</ActionButton>
