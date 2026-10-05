<script lang="ts">
  import AvatarStack from "$lib/components/avatar-stack/AvatarStack.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";

  const MAX_FACES = 3;

  const { users }: { users: ReadonlyArray<UserProfile> } = $props();

  const avatars = $derived(
    users.slice(0, MAX_FACES).map((user) => ({ key: user.key, user })),
  );
</script>

<AvatarStack {avatars} linked={false} />
