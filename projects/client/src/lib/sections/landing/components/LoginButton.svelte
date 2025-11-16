<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { login } = useAuth();
</script>

<Button
  label={m.button_label_login()}
  style="flat"
  size="small"
  color="default"
  navigationType={DpadNavigationType.Item}
  onclick={login}
>
  {m.button_text_login()}
  {#snippet icon()}
    <LockIcon />
  {/snippet}
</Button>
