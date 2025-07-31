<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { logout } = useAuth();
</script>

<Button
  size="small"
  onclick={logout}
  label={m.button_label_logout()}
  color="red"
  style="flat"
  navigationType={DpadNavigationType.Item}
>
  {m.button_text_logout()}
</Button>
