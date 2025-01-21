<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
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

<Link focusable={false} href={UrlBuilder.people(castMember.id)}>
  <div class="trakt-cast-member">
    <PersonCard>
      <CardCover
        src={castMember.headShotUrl}
        alt={`${m.person_headshot({ person: castMember.name })}`}
        style="flat"
      />
    </PersonCard>
    <div class="trakt-cast-member-footer">
      <p class="secondary ellipsis actor-name">{castMember.name}</p>
      <p class="small secondary ellipsis">{castMember.characterName}</p>
    </div>
  </div>
</Link>

<style>
  .trakt-cast-member-footer {
    height: var(--height-person-footer);
  }
  .trakt-cast-member {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    width: var(--width-person-card);
  }

  .actor-name {
    font-weight: 700;
  }
</style>
