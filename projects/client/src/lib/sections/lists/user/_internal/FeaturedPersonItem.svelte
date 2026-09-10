<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary.ts";
  import { peopleSummaryQuery } from "$lib/requests/queries/people/peopleSummaryQuery.ts";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  const { person, variant = "card" }: {
    person: PersonSummary;
    variant?: "card" | "summary";
  } = $props();

  let isVisible = $state(false);
  const query = useQuery(
    fromRune(() => ({ slug: person.slug, isVisible })).pipe(
      map(({ slug, isVisible }) => ({
        ...peopleSummaryQuery({ slug }),
        enabled: isVisible,
      })),
    ),
  );
  const profile = $derived($query.data ?? person);
  const description = $derived(
    profile.knownFor ? toTranslatedPosition(profile.knownFor) : "",
  );
</script>

<div
  class="trakt-featured-person-item"
  use:whenInViewport={() => (isVisible = true)}
>
  {#if variant === "summary"}
    <CreditMemberItem
      member={{
        key: person.slug,
        name: person.name,
        headshot: profile.headshot,
        description,
      }}
    />
  {:else}
    <Link focusable={false} href={UrlBuilder.people(person.slug)}>
      <CardCover
        title={person.name}
        src={profile.headshot.url.thumb}
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
