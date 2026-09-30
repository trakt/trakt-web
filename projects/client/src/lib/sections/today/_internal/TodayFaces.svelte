<script lang="ts">
  import AvatarStack from "$lib/components/avatar-stack/AvatarStack.svelte";
  import type { AvatarStackProps } from "$lib/components/avatar-stack/AvatarStackProps.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";

  const { users, size }: {
    users: ReadonlyArray<UserProfile>;
    size?: AvatarStackProps["size"];
  } = $props();

  const avatars = $derived(users.map((user) => ({ key: user.key, user })));
</script>

<AvatarStack {avatars} {size} variant="cutout" linked={false} />
