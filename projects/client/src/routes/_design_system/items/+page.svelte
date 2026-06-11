<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { CastMember } from "$lib/requests/models/MediaCrew.ts";
  import CastMemberItem from "$lib/sections/lists/components/CastMemberItem.svelte";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import DefaultPersonItem from "$lib/sections/lists/components/DefaultPersonItem.svelte";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember.ts";
  import ProfileCard from "$lib/sections/profile/components/ProfileCard.svelte";
  import ProfileItem from "$lib/sections/profile/components/ProfileItem.svelte";
  import { PersonFergusonMappedMock } from "$mocks/data/people/mapped/PersonFergusonMappedMock";
  import { MovieHereticMappedMock } from "$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock";
  import { MovieHereticPeopleMappedMock } from "$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock";
  import { MovieMatrixMappedMock } from "$mocks/data/summary/movies/matrix/MovieMatrixMappedMock";
  import { ShowDevsMappedMock } from "$mocks/data/summary/shows/devs/ShowDevsMappedMock";
  import { ShowSiloMappedMock } from "$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock";
  import { ShowSiloPeopleMappedMock } from "$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock";
  import { TraktTeamMappedMock } from "$mocks/data/team/mapped/TraktTeamMappedMock";
  import { UserProfileHarryMappedMock } from "$mocks/data/users/mapped/UserProfileHarryMappedMock";

  const movies = [MovieMatrixMappedMock, MovieHereticMappedMock];
  const shows = [ShowSiloMappedMock, ShowDevsMappedMock];
  const users = [
    UserProfileHarryMappedMock,
    ...TraktTeamMappedMock.slice(0, 3),
  ];
  const people = [PersonFergusonMappedMock];
  const castMembers = ShowSiloPeopleMappedMock.cast.slice(0, 4);

  const toCastDescriptionItems = (castMember: CastMember) =>
    (castMember.characters ?? [castMember.characterName])
      .filter(Boolean)
      .map((character) => character.trim())
      .filter(Boolean);

  const creditMembers = MovieHereticPeopleMappedMock.cast
    .slice(0, 3)
    .map((castMember): CreditMember => {
      const descriptionItems = toCastDescriptionItems(castMember);

      return {
        description: descriptionItems.join(", "),
        descriptionItems,
        headshot: castMember.headshot,
        key: castMember.key,
        name: castMember.name,
        positions: { movies: "acting" },
      };
    });
</script>

<main class="items-page">
  <section class="layout-section horizontal-row-stack">
    <h2>Horizontal Rows</h2>

    <SectionList
      id={{ scope: "design-system-items-horizontal-movies" }}
      items={movies}
      title="Movies"
      --height-list="var(--height-poster-list)"
    >
      {#snippet item(movie)}
        <DefaultMediaItem type="movie" media={movie} style="cover" />
      {/snippet}
    </SectionList>

    <SectionList
      id={{ scope: "design-system-items-horizontal-shows" }}
      items={shows}
      title="TV Shows"
      --height-list="var(--height-poster-list)"
    >
      {#snippet item(show)}
        <DefaultMediaItem type="show" media={show} style="cover" />
      {/snippet}
    </SectionList>

    <SectionList
      id={{ scope: "design-system-items-horizontal-users" }}
      items={users}
      title="Users"
      --height-list="var(--height-profile-list)"
    >
      {#snippet item(profile)}
        <ProfileItem {profile} />
      {/snippet}
    </SectionList>

    <SectionList
      id={{ scope: "design-system-items-horizontal-people" }}
      items={castMembers}
      title="People"
      --height-list="var(--height-person-list)"
    >
      {#snippet item(castMember)}
        <CastMemberItem {castMember} type="show" />
      {/snippet}
    </SectionList>
  </section>

  <section class="layout-section">
    <h2>Vertical Lists</h2>

    <div class="vertical-list-grid">
      <article class="item-group">
        <h3>Movies</h3>
        <div class="vertical-list" role="list">
          {#each movies as movie (movie.key)}
            <DefaultMediaItem type="movie" media={movie} style="summary" />
          {/each}
        </div>
      </article>

      <article class="item-group">
        <h3>TV Shows</h3>
        <div class="vertical-list" role="list">
          {#each shows as show (show.key)}
            <DefaultMediaItem type="show" media={show} style="summary" />
          {/each}
        </div>
      </article>

      <article class="item-group">
        <h3>People</h3>
        <div class="vertical-list" role="list">
          {#each creditMembers as member (member.key)}
            <CreditMemberItem {member} type="movie" />
          {/each}
        </div>
      </article>
    </div>
  </section>

  <section class="layout-section">
    <h2>Vertical Grids</h2>

    <div class="vertical-grid-stack">
      <article class="item-group">
        <h3>Movies</h3>
        <GridList
          id="design-system-items-grid-movies"
          items={movies}
          sizing="auto"
          --width-item="var(--width-portrait-card)"
        >
          {#snippet item(movie)}
            <DefaultMediaItem type="movie" media={movie} style="cover" />
          {/snippet}
        </GridList>
      </article>

      <article class="item-group">
        <h3>TV Shows</h3>
        <GridList
          id="design-system-items-grid-shows"
          items={shows}
          sizing="auto"
          --width-item="var(--width-portrait-card)"
        >
          {#snippet item(show)}
            <DefaultMediaItem type="show" media={show} style="cover" />
          {/snippet}
        </GridList>
      </article>

      <article class="item-group">
        <h3>Users</h3>
        <div class="profile-grid">
          {#each users as profile (profile.key)}
            <ProfileCard {profile} />
          {/each}
        </div>
      </article>

      <article class="item-group">
        <h3>People</h3>
        <GridList
          id="design-system-items-grid-people"
          items={people}
          sizing="auto"
          --width-item="var(--width-person-card)"
        >
          {#snippet item(person)}
            <DefaultPersonItem {person} />
          {/snippet}
        </GridList>
      </article>
    </div>
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .items-page,
  .layout-section,
  .vertical-grid-stack,
  .item-group,
  .vertical-list {
    display: flex;
    flex-direction: column;
  }

  .items-page {
    gap: var(--gap-xxl);
    min-width: 0;
    padding-block: var(--ni-32);

    @include for-tablet-sm-and-below {
      padding-block: var(--ni-20);
    }
  }

  .layout-section {
    gap: var(--gap-xl);
    min-width: 0;

    h2 {
      margin: 0;
    }
  }

  .horizontal-row-stack {
    gap: var(--gap-l);

    :global(.trakt-list-item-container),
    :global(.section-list-empty-state) {
      padding-inline: 0;
    }
  }

  .vertical-list-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(var(--ni-340), 100%), 1fr)
    );
    align-items: start;
    gap: var(--gap-xl);
    min-width: 0;
  }

  .vertical-grid-stack {
    gap: var(--gap-xxl);
    min-width: 0;
  }

  .item-group {
    gap: var(--gap-m);
    min-width: 0;

    h3 {
      margin: 0;
      color: var(--color-text-secondary);
    }
  }

  .vertical-list {
    gap: var(--gap-xs);
    min-width: 0;

    :global(.trakt-card) {
      --width-override-card: 100%;
    }
  }

  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--ni-148), 1fr));
    gap: var(--gap-l);
    min-width: 0;
  }
</style>
