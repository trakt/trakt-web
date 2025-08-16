<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { person }: { person: PersonSummary } = $props();
</script>

<PersonCard>
  <Link focusable={false} href={UrlBuilder.people(person.slug)}>
    <CardCover
      title={person.name}
      src={person.headshot.url.thumb}
      alt={`${m.image_alt_person_headshot({ person: person.name })}`}
    />
    <CardFooter>
      <p class="trakt-card-title ellipsis">
        {person.name}
      </p>
      {#if person.knownFor}
        <p class="trakt-card-subtitle ellipsis">
          {toTranslatedValue("position", person.knownFor)}
        </p>
      {/if}
    </CardFooter>
  </Link>
</PersonCard>
