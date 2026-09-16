<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary.ts";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { person, variant = "card" }: {
    person: PersonSummary;
    variant?: "card" | "summary";
  } = $props();

  const description = $derived(
    person.knownFor ? toTranslatedPosition(person.knownFor) : "",
  );
</script>

<div class="trakt-featured-person-item">
  {#if variant === "summary"}
    <CreditMemberItem
      member={{
        key: person.slug,
        name: person.name,
        headshot: person.headshot,
        description,
      }}
    />
  {:else}
    <Link focusable={false} href={UrlBuilder.people(person.slug)}>
      <CardCover
        title={person.name}
        src={person.headshot.url.thumb}
        alt={m.image_alt_person_headshot({ person: person.name })}
      />
    </Link>
    <CardFooter>
      <p class="trakt-card-title ellipsis" title={person.name}>{person.name}</p>
      {#if description}
        <p class="trakt-card-subtitle ellipsis" title={description}>{description}</p>
      {/if}
    </CardFooter>
  {/if}
</div>
