<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { fade } from "svelte/transition";
  import SoundtrackBoard from "./_internal/SoundtrackBoard.svelte";
  import { toSoundtrackSummary } from "./_internal/toSoundtrackSummary.ts";
  import { useSoundtrack } from "./useSoundtrack.ts";

  const { media, onClose }: { media: MediaEntry; onClose: () => void } =
    $props();

  const { tracks } = useSoundtrack(
    fromRune(() => ({ slug: media.slug, type: media.type })),
  );

  let isOpen = $state(false);

  const summary = $derived(toSoundtrackSummary($tracks));
</script>

{#snippet metaInfo()}
  <ListMetaInfo
    text={m.text_soundtrack_playable_ratio({
      playable: summary.playable,
      total: summary.total,
    })}
  />
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_soundtrack()}
  variant="vip"
  size="auto"
  {metaInfo}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="vip">
        <SoundtrackBoard
          {media}
          tracks={$tracks}
          {summary}
          source="soundtrack-drawer"
          layout="stacked"
        />
      </RenderFor>

      <RenderFor audience="free">
        <UpsellCta source="soundtrack" title={m.text_soundtrack_upsell()}>
          {m.vip_feature_description_soundtrack()}
        </UpsellCta>
      </RenderFor>
    </div>
  {/if}
</Drawer>
