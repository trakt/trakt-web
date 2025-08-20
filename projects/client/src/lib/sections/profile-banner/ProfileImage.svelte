<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import EditableImage from "$lib/features/image/components/EditableImage.svelte";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction";
  import { uploadAvatarRequest } from "$lib/requests/queries/users/uploadAvatarRequest";
  import { useInvalidator } from "$lib/stores/useInvalidator";

  const {
    name,
    src,
    isEditable = false,
  }: { name: string; src: string; isEditable?: boolean } = $props();

  const { invalidate } = useInvalidator();

  async function handleImageUploaded(ev: any) {
    const success = await uploadAvatarRequest({ avatar: ev.base64 });

    if (!success) {
      return;
    }

    invalidate(InvalidateAction.User.Avatar);
  }
</script>

<figure class="profile-image" data-sentry-block>
  <!-- This should be the first element, else: HierarchyRequestError -->
  <figcaption class="visually-hidden">
    {m.image_alt_user_avatar({ username: name })}
  </figcaption>

  {#if isEditable}
    <EditableImage
      {src}
      alt={m.image_alt_user_avatar({ username: name })}
      onchange={handleImageUploaded}
    />
  {:else}
    <CrossOriginImage {src} alt={m.image_alt_user_avatar({ username: name })} />
  {/if}
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
    width: var(--width);
    height: var(--height);
    border-radius: 50%;

    padding: var(--border-width);
    box-sizing: border-box;

    :global(.trakt-editable-image img) {
      transition: outline-color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-editable-image.dragover img) {
      outline-color: var(--purple-500);
    }

    :global(img) {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      outline: var(--border-width) solid var(--color-border-avatar);
    }
  }
</style>
