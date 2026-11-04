<script lang="ts">
  import LoaderIcon from "$lib/components/icons/LoaderIcon.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserTierRing from "$lib/features/vip-veteran/UserTierRing.svelte";
  import type { UserTierRingMotion } from "$lib/features/vip-veteran/UserTierRingMotion.ts";
  import type { TieredUser } from "$lib/features/vip-veteran/TieredUser.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction";
  import { removeAvatarRequest } from "$lib/requests/queries/users/removeAvatarRequest";
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
    member,
    ringMotion = "hover",
    hasEntrance = false,
    isHighlighted = false,
    badge,
  }: {
    name: string;
    src: string;
    member?: TieredUser | Nil;
    ringMotion?: UserTierRingMotion;
    hasEntrance?: boolean;
    isHighlighted?: boolean;
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

  async function handleRemovePhoto() {
    imageEdit.isUploading = true;
    const success = await removeAvatarRequest();
    imageEdit.isUploading = false;
    if (!success) return;
    invalidate(InvalidateAction.User.Avatar);
  }
</script>

<div class="trakt-profile-image" class:has-badge={badge != null}>
  <figure class="profile-image" data-sentry-block>
    <!-- This should be the first element, else: HierarchyRequestError -->
    <figcaption class="visually-hidden">
      {m.image_alt_user_avatar({ username: name })}
    </figcaption>

    <UserTierRing {member} motion={ringMotion} {hasEntrance} {isHighlighted}>
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
              ondragleave={(ev) =>
                ev.currentTarget.classList.remove("dragover")}
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
              <span class="edit-hint" aria-hidden="true">
                <RenameIcon />
              </span>
            </div>
          {/snippet}
        </ProfileImageContextMenu>
      {:else}
        <CrossOriginImage
          {src}
          alt={m.image_alt_user_avatar({ username: name })}
        />
      {/if}
    </UserTierRing>
  </figure>

  {#if imageEdit.isUploading}
    <div class="upload-overlay" transition:fade={{ duration: 150 }}>
      <div class="upload-spinner">
        <LoaderIcon />
      </div>
    </div>
  {/if}

  {#if badge}
    <div class="profile-image-badge">
      {@render badge()}
    </div>
  {/if}
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

  .trakt-profile-image {
    position: relative;

    &.has-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .profile-image-badge {
    display: flex;
    justify-content: center;
    z-index: var(--layer-base);
    margin-block-start: var(--ni-neg-16);

    &:not(:has(*)) {
      display: none;
    }
  }

  .profile-image {
    margin: 0;
    width: var(--image-size);
    height: var(--image-size);

    border-radius: 50%;
    box-sizing: border-box;
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
      outline-offset: calc(-1 * var(--border-thickness-xs));
    }
  }

  .edit-hint {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: color-mix(in srgb, var(--shade-900) 55%, transparent);
    pointer-events: none;

    opacity: 0;
    transition: opacity var(--transition-increment) ease-in-out;

    :global(svg) {
      width: 30%;
      height: 30%;
      color: var(--shade-10);
    }
  }

  .editable-image-wrapper:hover .edit-hint,
  .editable-image-wrapper:focus-visible .edit-hint {
    opacity: 1;
  }

  .upload-overlay {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
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

    :global(svg) {
      width: var(--ni-28);
      height: var(--ni-28);
      color: white;
    }
  }
</style>
