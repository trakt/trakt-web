<script lang="ts">
  import { dropzone } from "$lib/utils/actions/dropzone.ts";
  import { error } from "$lib/utils/console/print";
  import CrossOriginImage from "./CrossOriginImage.svelte";
  import type { ImageChangeEvent } from "./ImageChangeEvent";
  import type { ImageProps } from "./ImageProps";

  const {
    src,
    alt,
    onchange,
    ...rest
  }: ImageProps & { onchange: (ev: ImageChangeEvent) => void } = $props();

  function readImage(files: FileList | null) {
    if (!files || files.length === 0) return;

    const [file] = files;

    if (!file.type.startsWith("image/")) {
      error("File is not an image:", file.type);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      onchange({ base64 });
    };

    reader.readAsDataURL(file);
  }
</script>

<div
  tabindex="0"
  role="button"
  class="trakt-editable-image"
  use:dropzone
  onfiles={(ev) => readImage(ev.detail.files)}
>
  <CrossOriginImage {src} {alt} {...rest} />
</div>

<style>
  .trakt-editable-image {
    position: relative;
    display: block;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
</style>
