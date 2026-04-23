<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import HideIcon from "$lib/components/icons/HideIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { useHideRecommendation } from "./useHideRecommendation.ts";

  const { media }: { media: MediaEntry } = $props();

  const { hide, isHiding } = useHideRecommendation();

  const { confirm } = useConfirm();
  const confirmHide = $derived(
    confirm({
      type: ConfirmationType.HideRecommendation,
      title: media.title,
      onConfirm: () => hide({ slug: media.slug, type: media.type }),
    }),
  );
</script>

<DropdownItem
  onclick={confirmHide}
  style="flat"
  color="default"
  variant="secondary"
  label={m.button_label_hide_recommendation({ title: media.title })}
  disabled={$isHiding}
>
  {m.button_text_hide_recommendation()}
  {#snippet icon()}
    <HideIcon />
  {/snippet}
</DropdownItem>
