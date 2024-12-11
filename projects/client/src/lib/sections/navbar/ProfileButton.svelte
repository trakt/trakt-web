<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import ProfileImage from "../profile-banner/ProfileImage.svelte";

  const user = useUser();
  const variant = $derived(user.current().isVip ? "vip" : "primary");
</script>

<Button
  label="profile"
  {variant}
  style="textured"
  text="capitalize"
  size="small"
>
  {user.current().name.first}
  {#snippet icon()}
    <ProfileImage
      --width="var(--ni-24)"
      --height="var(--ni-24)"
      --border-width="var(--ni-2)"
    />
  {/snippet}
</Button>

<style>
  :global(.trakt-navbar .trakt-profile-button) {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  :global(.trakt-navbar .trakt-profile-button .profile-image) {
    width: var(--ni-32);
    height: var(--ni-32);
  }
</style>
