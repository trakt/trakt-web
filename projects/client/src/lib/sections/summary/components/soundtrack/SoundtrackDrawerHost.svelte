<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { fade } from "svelte/transition";
  import { filterBySeason } from "./_internal/filterBySeason.ts";
  import SoundtrackBoard from "./_internal/SoundtrackBoard.svelte";
  import { toSoundtrackSummary } from "./_internal/toSoundtrackSummary.ts";
  import { useSoundtrack } from "./useSoundtrack.ts";

  const {
    media,
    currentSeason,
    onClose,
  }: { media: MediaEntry; currentSeason?: number; onClose: () => void } =
    $props();

  const { tracks } = useSoundtrack(
    fromRune(() => ({ slug: media.slug, type: media.type })),
  );

  let isOpen = $state(false);
  let isSeasonOnly = $state(false);

  const hasSeasonTracks = $derived(
    currentSeason !== undefined &&
      $tracks.some((track) => track.season === currentSeason),
  );
  const shownTracks = $derived(
    filterBySeason(
      $tracks,
      hasSeasonTracks && isSeasonOnly ? (currentSeason ?? null) : null,
    ),
  );
  const summary = $derived(toSoundtrackSummary(shownTracks));
</script>

{#snippet actions()}
  {#if hasSeasonTracks && currentSeason !== undefined}
    {@const label = m.switch_label_soundtrack_season_only({
      number: currentSeason,
    })}
    <div class="soundtrack-season-filter">
      <span class="secondary">{label}</span>
      <Switch
        {label}
        checked={isSeasonOnly}
        onclick={() => (isSeasonOnly = !isSeasonOnly)}
      />
    </div>
  {/if}
{/snippet}

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
  {actions}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="vip">
        <SoundtrackBoard
          {media}
          tracks={shownTracks}
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

<style>
  .soundtrack-season-filter {
    display: flex;
    gap: var(--ni-8);
    align-items: center;
  }
</style>
