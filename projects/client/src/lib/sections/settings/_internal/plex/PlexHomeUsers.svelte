<script lang="ts">
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { plexSettingsQuery } from "$lib/requests/plex/plexSettingsQuery.ts";
  import { plexUpdateSettingsRequest } from "$lib/requests/plex/plexUpdateSettingsRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { map } from "rxjs";
  import SettingInputDrawer from "../SettingInputDrawer.svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";

  const { invalidate } = useInvalidator();

  const settingsQuery = useQuery(plexSettingsQuery());
  const homeUsers = settingsQuery.pipe(map((q) => q.data?.webhook.homeUsers));

  let isOpen = $state(false);
  let isSaving = $state(false);

  // Comma-separated usernames, no spaces (empty clears the field).
  const USERNAMES_PATTERN = /^[^\s,]+(,[^\s,]+)*$/;
  const usernamesValidation = {
    isValid: (value: string) => value === "" || USERNAMES_PATTERN.test(value),
    errorText: m.validation_text_plex_home_users(),
  };

  async function onSave(value: string) {
    isSaving = true;
    try {
      const success = await plexUpdateSettingsRequest({
        settings: { webhook: { home_users: value.trim() || null } },
      });

      if (!success) {
        return { error: m.error_text_failed_update() };
      }

      await invalidate(InvalidateAction.Plex.Settings);
    } finally {
      isSaving = false;
    }
  }
</script>

<SettingsGroupCard
  title={m.header_plex_home_users()}
  description={m.description_plex_home_users()}
>
  <SettingsGroupRow
    title={m.label_plex_home_users()}
    label={m.button_label_change_plex_home_users()}
    value={$homeUsers ?? ""}
    onclick={() => (isOpen = true)}
    disabled={$homeUsers === undefined || isSaving}
    variant="button"
  >
    {#snippet icon()}<PeopleIcon />{/snippet}
  </SettingsGroupRow>
</SettingsGroupCard>

{#if isOpen}
  <SettingInputDrawer
    type="input"
    title={m.header_plex_home_users()}
    name={m.label_plex_home_users()}
    currentValue={$homeUsers ?? ""}
    isRequired={false}
    customValidation={usernamesValidation}
    {isSaving}
    {onSave}
    onClose={() => (isOpen = false)}
  />
{/if}
