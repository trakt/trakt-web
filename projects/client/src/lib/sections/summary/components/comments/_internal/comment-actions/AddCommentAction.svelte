<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import ReplyIcon from "$lib/components/icons/ReplyIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  const { onclick }: { onclick: () => void } = $props();

  const commonProps = {
    label: m.button_label_add_comment(),
    style: "ghost" as const,
  };
</script>

<RenderFor audience="authenticated">
  <ActionButton {onclick} {...commonProps}>
    <ReplyIcon />
  </ActionButton>
</RenderFor>
