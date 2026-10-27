<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { useSeasonRecap } from "./useSeasonRecap.ts";

  const { slug, season }: { slug: string; season: number } = $props();

  const { recap } = useSeasonRecap(fromRune(() => ({ slug, season })));
  const { openSeasonRecapDrawer } = summaryDrawerNavigation();
</script>

{#if $recap}
  <Button
    onclick={openSeasonRecapDrawer}
    label={m.button_label_open_season_recap({
      season: m.text_season_number({ number: season }),
    })}
    color="purple"
    size="small"
  >
    {m.button_text_season_recap()}
    {#snippet icon()}
      <ClockIcon />
    {/snippet}
  </Button>
{/if}
