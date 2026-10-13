<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartListDraftSummary } from "$lib/requests/models/SmartListDraftSummary.ts";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import { toListOverlap } from "$lib/sections/smart-lists/toListOverlap.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import NudgeListPosters from "./NudgeListPosters.svelte";

  const { list }: { list: SmartListDraftSummary } = $props();

  const { list: summary } = useUserListSummary({
    userId: "me",
    listId: untrack(() => list.slug),
    withPosters: true,
  });

  const name = $derived($summary?.name ?? list.name ?? list.slug);

  const overlap = $derived(
    toListOverlap({ count: list.count ?? 0, confidence: list.confidence }),
  );
</script>

<li class="trakt-smart-list-nudge-row">
  <Link
    href={UrlBuilder.users("me").lists(list.slug)}
    label={name}
    focusable={false}
  >
    <NudgeListPosters posters={$summary?.posters ?? []} />
  </Link>

  <div class="row-copy">
    <Link href={UrlBuilder.users("me").lists(list.slug)}>
      <span class="row-name bold ellipsis">{name}</span>
    </Link>
    {#if overlap}
      <p class="secondary row-overlap ellipsis">
        {m.smart_list_nudge_row_overlap(overlap)}
      </p>
    {/if}
  </div>

  <Button
    size="small"
    color="purple"
    label={m.button_label_smart_list_convert_named({ name })}
    href={UrlBuilder.lists.smart.convert(list.slug)}
  >
    {m.button_text_convert()}
  </Button>
</li>

<style lang="scss">
  .trakt-smart-list-nudge-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--gap-s);

    background: var(--color-background);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-floating);
  }

  .row-copy {
    flex: 1 1 auto;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

    :global(.trakt-link) {
      display: block;
      min-width: 0;
    }
  }

  .row-name {
    display: block;
  }

  .row-overlap {
    font-size: var(--font-size-tag);
  }
</style>
