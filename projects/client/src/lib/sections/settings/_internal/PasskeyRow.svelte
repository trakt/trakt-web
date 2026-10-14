<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import { resolveOidcAuthority } from "$lib/features/auth/resolveOidcAuthority.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import SettingsRowControl from "./SettingsRowControl.svelte";

  const href = `${resolveOidcAuthority()}/passkey`;
</script>

<SettingsGroupRow
  title={m.text_passkey()}
  description={m.description_passkey()}
  variant="custom"
>
  {#snippet icon()}<LockIcon />{/snippet}

  <SettingsRowControl>
    <Button
      {href}
      variant="secondary"
      label={m.button_label_manage_passkey()}
    >
      {m.button_text_manage_passkey()}
    </Button>
  </SettingsRowControl>
</SettingsGroupRow>
