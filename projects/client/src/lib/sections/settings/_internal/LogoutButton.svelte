<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { logout } = useAuth();
</script>

<Button
  onclick={logout}
  label={m.logout()}
  color="red"
  style="flat"
  variant="primary"
  size="small"
  navigationType={DpadNavigationType.Item}
>
  {m.logout()}
</Button>
