<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type CastMemberCardProps = {
    castMember: CastMember;
    type: MediaType;
  };

  const { castMember, type }: CastMemberCardProps = $props();

  const params = $derived({
    [`${type}s`]: "acting" as const,
  });
</script>

{#snippet tag()}
  {#if type === "show" && castMember.episodeCount}
    <EpisodeCountTag
      count={castMember.episodeCount}
      i18n={TagIntlProvider}
      type="tag"
    />
  {/if}
{/snippet}

<PersonCard>
  <Link focusable={false} href={UrlBuilder.people(castMember.key, params)}>
    <CardCover
      title={castMember.name}
      src={castMember.headshot.url.thumb}
      alt={`${m.image_alt_person_headshot({ person: castMember.name })}`}
      {tag}
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
