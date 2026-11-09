<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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

{#snippet overflowLinks()}
  {#each overflow as link (link.type)}
    <ExternalLinkAction
      {...link}
      source="person-summary"
      style="dropdown-item"
    />
  {/each}
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

        <RenderFor audience="authenticated">
          <PopupMenu
            label={m.button_label_popup_menu({ title: person.name })}
            mode="standalone"
            size="normal"
            title={person.name}
          >
            {#snippet items()}
              {@render overflowLinks()}
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

        {#if overflow.length > 0}
          <RenderFor audience="public">
            <PopupMenu
              label={m.button_label_popup_menu({ title: person.name })}
              mode="standalone"
              size="normal"
              title={person.name}
            >
              {#snippet items()}
                {@render overflowLinks()}
              {/snippet}
            </PopupMenu>
          </RenderFor>
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
