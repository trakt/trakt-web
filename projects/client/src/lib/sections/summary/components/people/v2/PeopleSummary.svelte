<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import PersonTitle from "../../_internal/PersonTitle.svelte";
  import Summary from "./../../_internal/Summary.svelte";
  import SummaryOverview from "./../../summary/SummaryOverview.svelte";
  import ImdbLink from "./_internal/ImdbLink.svelte";
  import PersonDetails from "./_internal/PersonDetails.svelte";
  import SocialMediaLinks from "./_internal/SocialMediaLinks.svelte";
  import { hasSocialMediaLinks } from "./_internal/hasSocialMediaLinks";
  import FilterButton from "$lib/sections/navbar/components/filter/FilterButton.svelte";

  const { person }: { person: PersonSummary } = $props();
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<Summary>
  {#snippet poster()}
    <SummaryPoster src={person.headshot.url.medium} alt={person.name} {tags} />
  {/snippet}

  {#snippet sideActions()}
    <FilterButton isDisabled={false} />

    <ShareButton
      title={person.name}
      textFactory={({ title: name }) => m.text_share_person({ name })}
      source={{ id: "person" }}
    />
    {#if hasSocialMediaLinks(person)}
      <SocialMediaLinks {person} />
    {/if}
    <RenderFor audience="authenticated">
      <PopupMenu
        label={m.button_label_popup_menu({ title: person.name })}
        mode="standalone"
        size="normal"
      >
        {#snippet items()}
          <ReportButton
            params={{
              type: ReportableType.Person,
              id: person.id,
              title: person.name,
            }}
            label={m.button_label_report_person({ name: person.name })}
          />
        {/snippet}
      </PopupMenu>
    </RenderFor>
  {/snippet}

  {#snippet meta()}
    <PersonTitle name={person.name} knownFor={person.knownFor} />

    <PersonDetails
      birthday={person.birthday}
      deathDate={person.deathDate}
      height={person.height}
    />
  {/snippet}

  <SummaryOverview title={person.name} overview={person.biography} />
</Summary>
