<script lang="ts">
  import { goto } from "$app/navigation";
  import Select from "$lib/components/select/Select.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { Season } from "$lib/requests/models/Season";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type SeasonDropdownProps = {
    showSlug: string;
    seasons: Season[];
    currentSeason: number;
  };

  const { showSlug, seasons, currentSeason }: SeasonDropdownProps = $props();

  const options = $derived(
    seasons.map((season) => ({
      label: season.number.toString(),
      value: season.number.toString(),
    })),
  );

  const onChange = (value: string) => {
    goto(UrlBuilder.show(showSlug, { season: Number(value) }), {
      noscroll: true,
    });
  };
</script>

{#if seasons.length > 1}
  <Select
    {options}
    value={currentSeason.toString()}
    variant="pill"
    placeholder={m.list_title_seasons()}
    {onChange}
  />
{/if}
