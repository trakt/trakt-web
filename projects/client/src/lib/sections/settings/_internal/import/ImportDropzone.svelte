<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { dropzone } from "$lib/utils/actions/dropzone.ts";

  const {
    accept,
    maxFiles,
    prompt,
    onfiles,
  }: {
    accept: string;
    maxFiles: number;
    prompt: string;
    onfiles: (files: FileList) => void;
  } = $props();

  function handleFiles(ev: Event) {
    const { files } = (ev as CustomEvent<{ files: FileList }>).detail;
    if (files?.length) onfiles(files);
  }
</script>

<div
  class="import-dropzone"
  use:dropzone={{ accept, multiple: maxFiles > 1 }}
  onfiles={handleFiles}
>
  <p class="secondary">{prompt}</p>
  <p class="secondary tag">
    {m.import_max_files({ count: maxFiles })}
  </p>
</div>

<style lang="scss">
  .import-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    padding: var(--ni-24) var(--ni-20);
    min-height: var(--ni-104);

    border: var(--ni-2) dashed
      color-mix(in srgb, var(--color-border) 60%, transparent);
    border-radius: var(--border-radius-m);

    cursor: pointer;
    transition:
      border-color var(--transition-increment) ease-in-out,
      background-color var(--transition-increment) ease-in-out;

    &:hover,
    &:focus-visible,
    &.dragover {
      border-color: var(--color-primary);
      background-color: color-mix(
        in srgb,
        var(--color-primary) 5%,
        transparent
      );
      outline: none;
    }
  }
</style>
