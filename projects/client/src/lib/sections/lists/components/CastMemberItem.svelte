<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type CastMemberCardProps = {
    castMember: CastMember;
    type: ExtendedMediaType;
    variant?: "default" | "multi-line";
  };

  const {
    castMember,
    type,
    variant = "default",
  }: CastMemberCardProps = $props();

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

<div class="cast-member-item" data-variant={variant}>
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
      <p class="trakt-card-title trakt-cast-name" title={castMember.name}>
        {castMember.name}
      </p>
      <p
        class="trakt-card-subtitle trakt-cast-name"
        title={castMember.characterName}
      >
        {castMember.characterName}
      </p>
    </CardFooter>
  </PersonCard>
</div>

<style lang="scss">
  .cast-member-item {
    display: contents;
  }

  .trakt-cast-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cast-member-item[data-variant="multi-line"] {
    .trakt-cast-name {
      display: -webkit-box;

      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;

      overflow: hidden;
      overflow-wrap: anywhere;
      text-overflow: unset;
      white-space: unset;
      word-break: break-word;
    }

    :global(.trakt-card-footer) {
      align-items: flex-start;
    }
  }
</style>
