<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useLoginTarget } from "$lib/sections/navbar/components/useLoginTarget";

  const { target } = useLoginTarget();
</script>

<Button
  label={m.button_label_login()}
  style="flat"
  size="small"
  color="default"
  navigationType={DpadNavigationType.Item}
  {...$target}
>
  {m.button_text_login()}
  {#snippet icon()}
    <LockIcon />
  {/snippet}
</Button>
