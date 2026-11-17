<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import PersonAwardsStat from "$lib/sections/summary/components/awards/PersonAwardsStat.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import PersonTitle from "../_internal/PersonTitle.svelte";
  import SummaryContainer from "./../summary/SummaryContainer.svelte";
  import SummaryMarkdownOverview from "./../summary/SummaryMarkdownOverview.svelte";
  import DetailSeparator from "./v2/_internal/DetailSeparator.svelte";
  import ExpandableSocialMediaLinks from "./_internal/ExpandableSocialMediaLinks.svelte";
  import ImdbLink from "./v2/_internal/ImdbLink.svelte";
  import PersonDetails from "./v2/_internal/PersonDetails.svelte";
  import { splitSocialMediaLinks } from "./_internal/splitSocialMediaLinks";

  const { person }: { person: PersonSummary } = $props();

  const socialLinks = $derived(splitSocialMediaLinks(person.socialMedia));
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<SummaryContainer variant="compact">
  {#snippet poster()}
    <SummaryPoster
      src={person.headshot.url.medium}
      alt={person.name}
      {tags}
      isPriority
    />
  {/snippet}

  <div class="trakt-summary-main-content">
    <PersonTitle name={person.name} knownFor={person.knownFor}>
      {#snippet actions()}
        <ShareButton title={person.name} source={{ id: "person" }} />
      {/snippet}
    </PersonTitle>

    <SummaryMarkdownOverview
      title={person.name}
      overview={person.biography}
    />
  </div>

  <div class="person-meta-info">
    <PersonDetails
      height={person.height}
      birthday={person.birthday}
      deathDate={person.deathDate}
      variant="compact"
    >
      {#snippet trailing()}
        <RenderForFeature flag={FeatureFlag.Awards} audience="director">
          {#snippet enabled()}
            <PersonAwardsStat slug={person.slug}>
              {#snippet leading()}
                <DetailSeparator />
              {/snippet}
            </PersonAwardsStat>
          {/snippet}
        </RenderForFeature>
      {/snippet}
    </PersonDetails>

    {#if socialLinks.inline.length > 0}
      <DetailSeparator />
      <div class="person-social-media-links">
        <ExpandableSocialMediaLinks {...socialLinks} />
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
