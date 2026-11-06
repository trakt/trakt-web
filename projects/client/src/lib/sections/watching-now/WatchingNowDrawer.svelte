<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import WatchingNowPersonRow from "./_internal/WatchingNowPersonRow.svelte";
  import type { WatchingNowEntry } from "./models/WatchingNowEntry.ts";

  const {
    entries,
    onClose,
  }: { entries: ReadonlyArray<WatchingNowEntry>; onClose: () => void } =
    $props();

  const metaInfo = $derived(
    entries.length === 1
      ? m.text_watching_now_following_count_one()
      : m.text_watching_now_following_count_other({ count: entries.length }),
  );
</script>

<Drawer {onClose} title={m.header_watching_now()} {metaInfo} size="auto">
  <ul class="trakt-watching-now-drawer">
    {#each entries as entry (entry.key)}
      <WatchingNowPersonRow {entry} withTitle />
    {/each}
  </ul>
</Drawer>

<style lang="scss">
  .trakt-watching-now-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
