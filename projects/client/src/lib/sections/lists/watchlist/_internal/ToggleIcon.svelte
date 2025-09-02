<script lang="ts" generics="T">
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SocialIcon from "$lib/components/icons/SocialIcon.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  interface ToggleIconProps {
    option: ToggleOption<T>;
  }

  const { option }: ToggleIconProps = $props();

  const { user } = useUser();

  // FIXME: make the icon a prop of ToggleOption
</script>

{#if option.value === "all" || option.value === "media"}
  <MediaIcon />
{/if}

{#if option.value === "movie"}
  <MovieIcon />
{/if}

{#if option.value === "show"}
  <ShowIcon />
{/if}

{#if option.value === "social"}
  <SocialIcon />
{/if}

{#if option.value === "personal"}
  <CrossOriginImage
    src={$user.avatar.url}
    alt={m.image_alt_user_avatar({ username: $user.name.full })}
  />
{/if}
