<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import ReplyIcon from "$lib/components/icons/ReplyIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  const { onclick }: { onclick: () => void } = $props();

  const commonProps = {
    label: m.add_comment(),
    color: "purple" as const,
    variant: "secondary" as const,
  };
</script>

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  <Button size="small" {onclick} {...commonProps}>
    {m.add_comment()}
    {#snippet icon()}
      <ReplyIcon />
    {/snippet}
  </Button>
</RenderFor>

<RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
  <ActionButton {onclick} {...commonProps}>
    <ReplyIcon />
  </ActionButton>
</RenderFor>
