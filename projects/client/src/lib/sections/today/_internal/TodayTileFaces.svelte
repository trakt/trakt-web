<script lang="ts">
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";

  const MAX_FACES = 3;

  const { users }: { users: ReadonlyArray<UserProfile> } = $props();
</script>

<div class="trakt-today-tile-faces">
  {#each users.slice(0, MAX_FACES) as user (user.key)}
    <UserAvatar {user} size="small" />
  {/each}
</div>

<style>
  .trakt-today-tile-faces {
    display: flex;
    gap: var(--gap-xxs);
  }
</style>
