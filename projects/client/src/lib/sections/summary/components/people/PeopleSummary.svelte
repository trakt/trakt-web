<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import PersonTitle from "../_internal/PersonTitle.svelte";
  import SummaryContainer from "./../summary/SummaryContainer.svelte";
  import SummaryHeader from "./../summary/SummaryHeader.svelte";
  import SummaryOverview from "./../summary/SummaryOverview.svelte";
  import DetailSeparator from "./v2/_internal/DetailSeparator.svelte";
  import { hasSocialMediaLinks } from "./v2/_internal/hasSocialMediaLinks";
  import ImdbLink from "./v2/_internal/ImdbLink.svelte";
  import PersonDetails from "./v2/_internal/PersonDetails.svelte";
  import SocialMediaLinks from "./v2/_internal/SocialMediaLinks.svelte";

  const { person }: { person: PersonSummary } = $props();
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<SummaryContainer variant="compact">
  {#snippet poster()}
    <SummaryPoster src={person.headshot.url.medium} alt={person.name} {tags} />
  {/snippet}

  <div class="trakt-summary-main-content">
    <SummaryHeader title={person.name}>
      {#snippet popupActions()}
        <ShareButton
          title={person.name}
          textFactory={({ title: name }) => m.text_share_person({ name })}
          source={{ id: "person" }}
          style="dropdown-item"
        />
        <ReportButton
          params={{
            type: ReportableType.Person,
            id: person.id,
            title: person.name,
          }}
          label={m.button_label_report_person({ name: person.name })}
        />
      {/snippet}

      <PersonTitle name={person.name} knownFor={person.knownFor} />
    </SummaryHeader>

    <SummaryOverview title={person.name} overview={person.biography} />
  </div>

  <div class="person-meta-info">
    <PersonDetails
      height={person.height}
      birthday={person.birthday}
      deathDate={person.deathDate}
      variant="compact"
    />

    {#if hasSocialMediaLinks(person)}
      <DetailSeparator />
      <div class="person-social-media-links">
        <SocialMediaLinks {person} />
      </div>
    {/if}
  </div>
</SummaryContainer>

<style>
  .person-meta-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--gap-m);
  }

  .trakt-summary-main-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    flex: 1;
  }

  .person-social-media-links {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
