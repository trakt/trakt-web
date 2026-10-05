<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import AddFromListsHost from "./AddFromListsHost.svelte";

  const { list }: { list: MediaListSummary } = $props();
</script>

<AddFromListsHost {list}>
  {#snippet children(open)}
    <div class="trakt-add-from-lists-empty">
      <p class="secondary">{m.text_empty_list_add_from_lists()}</p>

      <Button
        label={m.button_label_add_from_lists({ name: list.name })}
        color="purple"
        onclick={open}
      >
        {m.button_text_add_from_lists()}
      </Button>
    </div>
  {/snippet}
</AddFromListsHost>

<style lang="scss">
  .trakt-add-from-lists-empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-m);
    padding: var(--gap-xl);
    max-width: 36rem;
  }
</style>
