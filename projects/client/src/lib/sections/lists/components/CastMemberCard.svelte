<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type CastMemberCardProps = {
    castMember: CastMember;
  };

  const { castMember }: CastMemberCardProps = $props();
</script>

<trakt-cast-member>
  <Link
    focusable={false}
    href={UrlBuilder.people(castMember.id)}
    navigationType={DpadNavigationType.Item}
  >
    <PersonCard>
      <CardCover
        title={castMember.name}
        src={castMember.headShotUrl}
        alt={`${m.person_headshot({ person: castMember.name })}`}
        style="flat"
      />
      <CardFooter>
        <p class="trakt-card-title ellipsis">
          {castMember.name}
        </p>
        <p class="trakt-card-subtitle ellipsis">
          {castMember.characterName}
        </p>
      </CardFooter>
    </PersonCard>
  </Link>
</trakt-cast-member>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-cast-member {
    position: relative;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }
</style>
