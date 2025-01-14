<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { CastMember } from "$lib/requests/models/MediaCrew";

  type CastMemberItemProps = {
    castMember: CastMember;
  };

  const { castMember }: CastMemberItemProps = $props();
</script>

<div class="trakt-cast-member">
  <PersonCard>
    <CardCover
      src={castMember.headShotUrl}
      alt={`${m.person_headshot({ person: castMember.name })}`}
      style="flat"
    ></CardCover>
  </PersonCard>
  <div>
    <p class="secondary ellipsis actor-name">{castMember.name}</p>
    <p class="small secondary ellipsis">{castMember.characterName}</p>
  </div>
</div>

<style>
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
