<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type CastMemberCardProps = {
    castMember: CastMember;
  };

  const { castMember }: CastMemberCardProps = $props();
</script>

<PersonCard>
  <Link focusable={false} href={UrlBuilder.people(castMember.key)}>
    <CardCover
      title={castMember.name}
      src={castMember.headshot.url.thumb}
      alt={`${m.image_alt_person_headshot({ person: castMember.name })}`}
    />
  </Link>
  <CardFooter>
    <p class="trakt-card-title ellipsis">
      {castMember.name}
    </p>
    <p class="trakt-card-subtitle ellipsis">
      {castMember.characterName}
    </p>
  </CardFooter>
</PersonCard>
