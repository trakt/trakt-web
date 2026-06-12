<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery";
  import { blockedUsersQuery } from "$lib/requests/queries/users/blockedUsersQuery";
  import { map } from "rxjs";
  import BlockedUserRow from "./BlockedUserRow.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";

  const blockedUsers = useQuery(blockedUsersQuery()).pipe(
    map((query) => query.data ?? []),
  );
</script>

<SettingsSectionLabel title={m.heading_blocked_users()} />

<SettingsGroupCard>
  {#if $blockedUsers.length === 0}
    <p class="empty-state small secondary">{m.text_no_blocked_users()}</p>
  {:else}
    {#each $blockedUsers as profile (profile.key)}
      <BlockedUserRow {profile} />
    {/each}
  {/if}
</SettingsGroupCard>

<style>
  .empty-state {
    padding: var(--gap-m);
  }
</style>
