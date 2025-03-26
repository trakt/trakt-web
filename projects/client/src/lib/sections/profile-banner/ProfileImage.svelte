<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  import * as m from "$lib/features/i18n/messages.ts";

  const { name, src }: { name: string; src: string } = $props();
</script>

<figure class="profile-image">
  <!-- This should be the first element, else: HierarchyRequestError -->
  <figcaption class="visually-hidden">
    {m.profile_banner_greeting({ name })}
  </figcaption>
  <CrossOriginImage {src} alt={m.users_avatar({ username: name })} />
</figure>

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .profile-image {
    margin: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    width: var(--width);
    height: var(--height);
    border-radius: 50%;
    overflow: hidden;

    border: var(--border-width) solid var(--color-border-avatar);
  }
</style>
