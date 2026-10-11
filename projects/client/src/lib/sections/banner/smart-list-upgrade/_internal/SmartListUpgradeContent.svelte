<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/buttons/Button.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { SmartListDraft } from "$lib/requests/models/SmartListDraft.ts";
  import { toListOverlap } from "$lib/sections/smart-lists/toListOverlap.ts";
  import { useConvertSmartList } from "$lib/sections/smart-lists/useConvertSmartList.ts";
  import { useSmartListDraft } from "$lib/sections/smart-lists/useSmartListDraft.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import BannerCta from "../../_internal/BannerCta.svelte";
  import SmartListUpgradeCard from "./SmartListUpgradeCard.svelte";
  import { toSmartListDraftChips } from "./toSmartListDraftChips.ts";
  import { toStaleOriginName } from "./toStaleOriginName.ts";

  const { list, onDismiss }: { list: MediaListSummary; onDismiss: () => void } =
    $props();

  const { draft, isLoading } = useSmartListDraft({
    userId: "me",
    listId: untrack(() => list.slug),
  });

  const { convertList, isConverting } = useConvertSmartList();
  const { notify } = useActionToast();

  const onConvert = async (draft: SmartListDraft) => {
    const slug = await convertList({
      listId: list.slug,
      name: list.name,
      draft,
    });

    if (!slug) {
      notify({ message: m.action_toast_action_failed(), variant: "error" });
      return;
    }

    goto(UrlBuilder.lists.smart.view(slug));
  };

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
    <Button
      size="small"
      color="purple"
      type="button"
      label={m.button_label_smart_list_convert()}
      disabled={$isConverting}
      onclick={() => onConvert($draft)}
    >
      {m.button_text_smart_list_convert()}
    </Button>
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
