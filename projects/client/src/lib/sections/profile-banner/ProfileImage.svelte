<script lang="ts">
  import LoaderIcon from "$lib/components/icons/LoaderIcon.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction";
  import { uploadAvatarRequest } from "$lib/requests/queries/users/uploadAvatarRequest";
  import { useInvalidator } from "$lib/stores/useInvalidator";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import ProfileImageContextMenu from "./_internal/ProfileImageContextMenu.svelte";
  import ProfileImageCropDialog from "./_internal/ProfileImageCropDialog.svelte";
  import ProfileImageViewDialog from "./_internal/ProfileImageViewDialog.svelte";
  const {
    name,
    src,
    isEditable = false,
    isVip = false,
    badge,
  }: {
    name: string;
    src: string;
    isVip?: boolean;
    isEditable?: boolean;
    badge?: Snippet;
  } = $props();

  const { invalidate } = useInvalidator();

  type Dialog = "none" | "view" | "crop";

  const imageEdit = $state<{
    dialog: Dialog;
    pendingBase64: string | null;
    isUploading: boolean;
  }>({
    dialog: "none",
    pendingBase64: null,
    isUploading: false,
  });

  function openFilePicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (!input.files?.length) return;
      readFile(input.files[0]);
    };
    input.click();
  }

  function readFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      imageEdit.pendingBase64 = ev.target?.result as string;
      imageEdit.dialog = "crop";
    };
    reader.readAsDataURL(file);
  }

  function handleFilesDropped(files: FileList) {
    const [file] = files;
    if (file) readFile(file);
  }

  async function handleCropConfirmed(base64: string) {
    imageEdit.dialog = "none";
    imageEdit.pendingBase64 = null;
    imageEdit.isUploading = true;
    const success = await uploadAvatarRequest({ avatar: base64 });
    imageEdit.isUploading = false;
    if (!success) return;
    invalidate(InvalidateAction.User.Avatar);
  }

  function generateTransparentAvatar(): string {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/png");
  }

  async function handleRemovePhoto() {
    imageEdit.isUploading = true;
    const success = await uploadAvatarRequest({
      avatar: generateTransparentAvatar(),
    });
    imageEdit.isUploading = false;
    if (!success) return;
    invalidate(InvalidateAction.User.Avatar);
  }

  /*
    TODO:
    -confirmation on remove
    -edit badge position in combination with vip badge
    -dialog title + close position?
    -upload button in dialog footer?
  */
</script>

<div class="profile-image-container" class:is-vip={isVip}>
  <figure class="profile-image" data-sentry-block>
    <!-- This should be the first element, else: HierarchyRequestError -->
    <figcaption class="visually-hidden">
      {m.image_alt_user_avatar({ username: name })}
    </figcaption>

    {#if isEditable}
      <ProfileImageContextMenu
        onViewPhoto={() => (imageEdit.dialog = "view")}
        onUploadPhoto={openFilePicker}
        onRemovePhoto={handleRemovePhoto}
      >
        {#snippet trigger(props)}
          <div
            {...props}
            class="editable-image-wrapper"
            role="button"
            tabindex="0"
            aria-label={m.button_label_upload_photo()}
            ondragover={(ev) => {
              ev.preventDefault();
              ev.currentTarget.classList.add("dragover");
            }}
            ondragleave={(ev) => ev.currentTarget.classList.remove("dragover")}
            ondrop={(ev) => {
              ev.preventDefault();
              ev.currentTarget.classList.remove("dragover");
              const { files } = ev.dataTransfer ?? {};
              if (files?.length) handleFilesDropped(files);
            }}
          >
            <CrossOriginImage
              {src}
              alt={m.image_alt_user_avatar({ username: name })}
            />
          </div>
        {/snippet}
      </ProfileImageContextMenu>
      <div class="edit-badge" aria-hidden="true">
        <RenameIcon />
      </div>
    {:else}
      <CrossOriginImage
        {src}
        alt={m.image_alt_user_avatar({ username: name })}
      />
    {/if}
  </figure>

  {#if imageEdit.isUploading}
    <div class="upload-overlay" transition:fade={{ duration: 150 }}>
      <div class="upload-spinner">
        <LoaderIcon />
      </div>
    </div>
  {/if}

  {@render badge?.()}
</div>

{#if imageEdit.dialog === "view"}
  <ProfileImageViewDialog
    {src}
    alt={m.image_alt_user_avatar({ username: name })}
    onClose={() => (imageEdit.dialog = "none")}
  />
{/if}

{#if imageEdit.dialog === "crop" && imageEdit.pendingBase64}
  <ProfileImageCropDialog
    src={imageEdit.pendingBase64}
    onConfirm={handleCropConfirmed}
    onClose={() => {
      imageEdit.dialog = "none";
      imageEdit.pendingBase64 = null;
    }}
  />
{/if}

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

  .profile-image-container {
    position: relative;

    &.is-vip {
      --color-border-avatar: var(--color-border-vip-avatar);
    }
  }

  .profile-image {
    margin: 0;
    width: var(--image-size);
    height: var(--image-size);

    border-radius: 50%;
    outline: var(--border-width) solid var(--color-border-avatar);
    outline-offset: calc(-1 * var(--border-width));

    padding: var(--border-width);
    box-sizing: border-box;

    :global(img) {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .editable-image-wrapper {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: 2px;
    }
  }

  .edit-badge {
    --edit-badge-size: var(--ni-24);
    --edit-badge-offset: calc(0.3 * var(--edit-badge-size));

    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(var(--edit-badge-offset), var(--edit-badge-offset));

    z-index: var(--layer-raised);

    width: var(--edit-badge-size);
    height: var(--edit-badge-size);
    border-radius: 50%;
    background-color: var(--color-modal-background);
    box-shadow: var(--shadow-floating);

    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    opacity: 0;
    transition:
      opacity var(--transition-increment) ease-in-out,
      transform var(--transition-increment) ease-in-out;

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
      color: var(--color-text-primary);
    }
  }

  .profile-image-container:has(.editable-image-wrapper:hover),
  .profile-image-container:has(.editable-image-wrapper:focus-visible) {
    .edit-badge {
      opacity: 1;
      transform: translate(var(--edit-badge-offset), var(--edit-badge-offset))
        scale(1.1);
    }
  }

  .upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--image-size);
    height: var(--image-size);
    border-radius: 50%;
    overflow: hidden;
    background-color: color-mix(in srgb, var(--shade-900) 55%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: calc(var(--layer-raised) + 1);
    cursor: wait;
  }

  .upload-spinner {
    display: flex;
    animation: upload-spin 1.2s linear infinite;

    :global(svg) {
      width: var(--ni-28);
      height: var(--ni-28);
      color: white;
    }
  }

  @keyframes upload-spin {
    to {
      transform: rotate(1turn);
    }
  }
</style>
