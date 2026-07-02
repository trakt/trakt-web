<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import NativeSelect from "$lib/components/select/NativeSelect.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import FavoriteServicesDrawerHost from "./FavoriteServicesDrawerHost.svelte";
  import ServiceLogoBox from "./ServiceLogoBox.svelte";
  import { useStreamingServices } from "./useStreamingServices.ts";

  const { country, favoriteSources, availableCountries, setCountry } =
    useStreamingServices();

  const countryName = (code: string) => toCountryName(code, languageTag());

  const countryOptions = $derived(
    ($availableCountries ?? [])
      .map((code) => {
        const name = countryName(code);
        return {
          value: code,
          text: name,
          label: name,
        };
      })
      .toSorted((a, b) => a.text.localeCompare(b.text, languageTag())),
  );

  const favorites = $derived($favoriteSources ?? []);

  let isDrawerOpen = $state(false);
</script>

<SettingsGroupCard
  title={m.header_streaming_services()}
  description={m.description_streaming_services()}
>
  <SettingsGroupRow title={m.label_streaming_country()} variant="custom">
    {#snippet icon()}<GlobeIcon />{/snippet}
    <NativeSelect
      value={$country}
      options={countryOptions}
      onChange={(value) => setCountry(value)}
      getDisplayText={(value) => countryName(value)}
    />
  </SettingsGroupRow>

  <SettingsGroupRow title={m.label_favorites()} variant="custom">
    {#snippet icon()}<FavoriteIcon />{/snippet}
    <Button
      size="small"
      variant="primary"
      color="purple"
      label={m.button_text_manage()}
      onclick={() => (isDrawerOpen = true)}
    >
      {m.button_text_manage()}
    </Button>
  </SettingsGroupRow>

  {#if favorites.length > 0}
    <div class="trakt-favorite-services-list">
      {#each favorites as source (source.source)}
        <ServiceLogoBox source={source.source} selected ring={false} />
      {/each}
    </div>
  {/if}
</SettingsGroupCard>

{#if isDrawerOpen}
  <FavoriteServicesDrawerHost onClose={() => (isDrawerOpen = false)} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-favorite-services-list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--gap-s);

    padding: var(--gap-m);

    @include for-mobile {
      // Six fixed columns force a min width wider than a phone (each tile holds
      // a fixed-size logo), which drags the whole settings column too wide.
      // Wrap to three so the preview and the rest of the page fit the viewport.
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
