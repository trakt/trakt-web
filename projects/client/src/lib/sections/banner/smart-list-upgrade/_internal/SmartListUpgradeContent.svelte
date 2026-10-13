<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { toListOverlap } from "$lib/sections/smart-lists/toListOverlap.ts";
  import { useSmartListDraft } from "$lib/sections/smart-lists/useSmartListDraft.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import BannerCta from "../../_internal/BannerCta.svelte";
  import SmartListUpgradeCard from "./SmartListUpgradeCard.svelte";
  import { toSmartListDraftChips } from "$lib/sections/smart-lists/toSmartListDraftChips.ts";
  import { toStaleOriginName } from "./toStaleOriginName.ts";

  const { list, onDismiss }: { list: MediaListSummary; onDismiss: () => void } =
    $props();

  const { draft, isLoading } = useSmartListDraft({
    userId: "me",
    listId: untrack(() => list.slug),
  });

  const origin = $derived(toStaleOriginName(list.staleOrigin?.name ?? ""));

  const overlap = $derived(
    $draft
      ? toListOverlap({ count: list.count, confidence: $draft.confidence })
      : null,
  );
  const summary = $derived(
    overlap ? m.smart_list_upgrade_overlap(overlap) : undefined,
  );
  const detail = $derived(
    $draft ? toSmartListDraftChips($draft).join(" · ") : "",
  );
</script>

{#if $draft}
  {#snippet actions()}
    <GlobalParameterEscaper enabled>
      <Button
        size="small"
        color="purple"
        label={m.button_label_smart_list_convert()}
        href={UrlBuilder.lists.smart.convert(list.slug)}
      >
        {m.button_text_smart_list_convert()}
      </Button>
    </GlobalParameterEscaper>
  {/snippet}

  <SmartListUpgradeCard
    variant="draft"
    title={m.smart_list_upgrade_draft_title()}
    {summary}
    {detail}
    {origin}
    {onDismiss}
    {actions}
  />
{:else if !$isLoading}
  {#snippet plainActions()}
    <BannerCta
      href={UrlBuilder.lists.smart.create()}
      label={m.button_text_create_smart_list()}
    >
      {m.button_text_create_smart_list()}
    </BannerCta>
  {/snippet}

  <SmartListUpgradeCard
    variant="plain"
    title={m.smart_list_upgrade_plain_title()}
    detail={m.smart_list_upgrade_plain_description()}
    {origin}
    {onDismiss}
    actions={plainActions}
  />
{/if}
