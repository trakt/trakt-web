<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import PersonAwardsStat from "$lib/sections/summary/components/awards/PersonAwardsStat.svelte";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import ExternalLinkAction from "$lib/sections/summary/components/_internal/ExternalLinkAction.svelte";
  import FilterButton from "$lib/sections/navbar/components/filter/FilterButton.svelte";
  import PersonTitle from "../../_internal/PersonTitle.svelte";
  import Summary from "./../../_internal/Summary.svelte";
  import SummaryMarkdownOverview from "./../../summary/SummaryMarkdownOverview.svelte";
  import ImdbLink from "./_internal/ImdbLink.svelte";
  import PersonDetails from "./_internal/PersonDetails.svelte";
  import SocialMediaLinks from "../_internal/SocialMediaLinks.svelte";
  import { splitSocialMediaLinks } from "../_internal/splitSocialMediaLinks";

  const { person }: { person: PersonSummary } = $props();

  const { inline, overflow } = $derived(
    splitSocialMediaLinks(person.socialMedia),
  );
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<Summary>
  {#snippet poster()}
    <SummaryPoster
      src={person.headshot.url.medium}
      alt={person.name}
      {tags}
      isPriority
    />
  {/snippet}

  {#snippet sideActions()}
    <div class="person-side-actions">
      <div class="person-side-actions-group">
        <FilterButton isDisabled={false} />

        <ShareButton
          title={person.name}
          source={{ id: "person" }}
        />
      </div>

      <div class="person-side-actions-group">
        <SocialMediaLinks links={inline} />

        {#if overflow.length > 0}
          <PopupMenu
            label={m.button_label_popup_menu({ title: person.name })}
            mode="standalone"
            size="normal"
            title={person.name}
          >
            {#snippet items()}
              {#each overflow as link (link.type)}
                <ExternalLinkAction
                  {...link}
                  source="person-summary"
                  style="dropdown-item"
                />
              {/each}
            {/snippet}
          </PopupMenu>
        {/if}
      </div>
    </div>
  {/snippet}

  {#snippet meta()}
    <PersonTitle name={person.name} knownFor={person.knownFor} />

    <PersonDetails
      birthday={person.birthday}
      deathDate={person.deathDate}
      height={person.height}
    />
    <RenderForFeature flag={FeatureFlag.Awards} audience="director">
      {#snippet enabled()}
        <PersonAwardsStat slug={person.slug} />
      {/snippet}
    </RenderForFeature>
  {/snippet}

  <SummaryMarkdownOverview
    title={person.name}
    overview={person.biography}
  />
</Summary>

<style>
  .person-side-actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-s);

    flex: 1;
  }

  .person-side-actions-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
