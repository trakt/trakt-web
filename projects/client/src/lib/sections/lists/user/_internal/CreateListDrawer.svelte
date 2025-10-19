<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { writable } from "svelte/store";
  import { useCreateList } from "./useCreateList";

  const { onClose }: { onClose: () => void } = $props();

  const listName = writable("");

  const { createList, isCreating } = useCreateList();

  // TODO no drawer header on mobile
  // TODO extract common input component & re-use in search (with icon as optional prop)
</script>

<Drawer {onClose} title="">
  <div class="trakt-list-container">
    <div class="trakt-list-properties">
      <input
        class="trakt-input"
        placeholder="Enter your list name"
        oninput={(e) => listName.set((e.target as HTMLInputElement).value)}
      />
    </div>
    <div class="trakt-list-actions">
      <Button
        size="small"
        variant="secondary"
        color="default"
        onclick={onClose}
        disabled={$isCreating}
        label="TODO">Cancel</Button
      >
      <Button
        size="small"
        variant="secondary"
        color="purple"
        disabled={$isCreating || $listName.trim().length === 0}
        onclick={async () => {
          await createList($listName);
          onClose();
        }}
        label="TODO">Create list</Button
      >
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-8);
  }

  .trakt-list-actions {
    display: flex;
    gap: var(--gap-xs);

    :global(.trakt-button) {
      flex: 1;
    }

    @include for-mobile() {
      flex-direction: column;
    }
  }

  .trakt-input {
    all: unset;

    height: var(--ni-48);
    width: 100%;

    padding: var(--ni-8) var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);
    background: var(--cm-background-25);

    outline: var(--border-thickness-xs) solid var(--shade-100);

    transition: var(--transition-increment) ease-in-out;
    transition-property:
      outline, border-color, background-color, padding, width, top, left,
      opacity;

    backdrop-filter: blur(var(--ni-8));

    &:placeholder-shown {
      text-overflow: ellipsis;
    }

    &:focus-within {
      outline-color: var(--purple-600);
      opacity: 1;
    }
  }
</style>
