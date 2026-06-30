<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  const {
    slug,
    year,
    coverImage,
  }: {
    slug: string;
    year: number;
    coverImage: string | Nil;
  } = $props();

  const profileQuery = $derived(useQuery(userProfileQuery({ slug })));
  const profile = $derived(profileQuery.pipe(map(($q) => $q.data)));

  const now = new Date();
  const isCurrentYear = $derived(year === now.getFullYear());
  const subtitle = $derived(
    isCurrentYear ? m.yir_title_year_to_date() : m.yir_title_year_in_review(),
  );

  const coverSrc = $derived(
    $profile?.cover?.url || coverImage || DEFAULT_COVER,
  );
</script>

<section class="trakt-yir-title-section">
  <div class="yir-cover-bg">
    <CrossOriginImage src={coverSrc} alt="" />
  </div>
  <div class="yir-titles-wrapper">
    <div class="yir-titles">
      {#if $profile}
        <div class="yir-user">
          <span class="yir-avatar-link">
            <Link href={UrlBuilder.profile.user(slug)} color="inherit">
              <div class="yir-avatar">
                <CrossOriginImage
                  src={$profile.avatar.url}
                  alt={$profile.name.full ?? slug}
                />
              </div>
            </Link>
          </span>
          <span class="yir-display-name">
            <Link href={UrlBuilder.profile.user(slug)} color="inherit">
              {$profile.name.full || $profile.username}
            </Link>
          </span>
        </div>
        <div class="yir-under-user"></div>
      {/if}

      <h1 class="yir-year">{year}</h1>
      <h2 class="yir-subtitle">{subtitle}</h2>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-title-section {
    // Poster hero: cover image + dark panel + white text in both themes.
    // Pin the shared chrome tokens (consumed by YirSectionHeader and the
    // text below) to their always-dark poster values so the overlay stays
    // legible regardless of the active theme.
    --color-yir-text-primary: var(--color-yir-poster-foreground);
    --color-yir-border: var(--color-yir-poster-foreground);
    --color-yir-title-chip-background: var(--color-yir-scrim);

    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    background-color: var(--color-yir-poster-background);
    color: var(--color-yir-poster-foreground);
    position: relative;
    overflow: hidden;
  }

  .yir-cover-bg {
    position: absolute;
    inset: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .yir-titles-wrapper {
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .yir-titles {
    display: inline-block;
    background: radial-gradient(
      circle,
      var(--color-yir-poster-surface-raised) 20%,
      var(--color-yir-poster-background) 80%
    );
    padding: var(--ni-20);
    box-shadow: 0 0 var(--ni-52) var(--color-yir-poster-surface);

    @include for-mobile {
      max-width: 80%;
    }
  }

  .yir-user {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-10);
  }

  .yir-avatar-link {
    display: flex;
    flex-shrink: 0;

    :global(.trakt-link) {
      display: flex;
      text-decoration: none;
    }
  }

  .yir-avatar {
    width: var(--ni-40);
    height: var(--ni-40);
    border-radius: 50%;
    border: var(--border-thickness-xs) solid var(--color-yir-poster-foreground);
    background-color: var(--color-yir-poster-foreground);
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    @include for-mobile {
      width: var(--ni-30);
      height: var(--ni-30);
    }
  }

  .yir-display-name {
    display: inline-block;
    font-size: var(--ni-24);

    :global(.trakt-link) {
      color: var(--color-yir-poster-foreground);
      text-decoration: none;
    }

    @include for-mobile {
      font-size: var(--ni-20);
    }
  }

  .yir-under-user {
    width: var(--ni-380);
    max-width: 100%;
    border-bottom: var(--border-thickness-xxs) dashed var(--color-yir-text-muted);
    margin: var(--ni-24) auto var(--ni-6) auto;

    @include for-mobile {
      width: var(--ni-256);
    }
  }

  .yir-year {
    font-size: var(--ni-180);
    font-weight: normal;
    margin: 0;
    line-height: 1;
    color: var(--color-yir-poster-foreground);

    @include for-mobile {
      font-size: var(--ni-104);
    }
  }

  .yir-subtitle {
    background-color: var(--color-yir-poster-foreground);
    color: var(--color-yir-poster-background);
    display: block;
    text-transform: uppercase;
    padding: var(--ni-8) var(--ni-16);
    letter-spacing: 3px;
    word-spacing: 5px;
    margin: 0;
    text-align: center;
    font-size: var(--ni-18);
    font-weight: normal;
    line-height: 1;
  }
</style>
