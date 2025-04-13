<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { url } = useAuth();
</script>

<Button
  href={$url}
  label={m.join_trakt_button_label()}
  style="flat"
  size="small"
  color="purple"
  variant="primary"
  navigationType={DpadNavigationType.Item}
>
  {m.join_trakt_button()}
</Button>
