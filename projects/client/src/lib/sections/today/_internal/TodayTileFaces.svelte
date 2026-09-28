<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";

  const MAX_FACES = 3;

  const { users }: { users: ReadonlyArray<UserProfile> } = $props();
</script>

<div class="trakt-today-tile-faces">
  {#each users.slice(0, MAX_FACES) as user (user.key)}
    <CrossOriginImage src={user.avatar.url} alt="" />
  {/each}
</div>

<style lang="scss">
  .trakt-today-tile-faces {
    display: flex;

    padding: var(--ni-4);

    :global(img) {
      width: var(--ni-24);
      height: var(--ni-24);

      border: var(--border-thickness-xs) solid var(--color-background);
      border-radius: 50%;
    }

    :global(img + img) {
      margin-inline-start: calc(-1 * var(--ni-8));
    }
  }
</style>
