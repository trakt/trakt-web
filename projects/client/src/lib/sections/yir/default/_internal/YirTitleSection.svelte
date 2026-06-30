<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  const {
    slug,
    year,
    coverImage: _,
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
</script>

<section class="trakt-yir-title-section">
  <div class="yir-cover-bg"></div>
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
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    background-color: var(--shade-950);
    position: relative;
    overflow: hidden;
  }

  .yir-cover-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        ellipse 70% 65% at 25% 52%,
        var(--purple-700) 0%,
        transparent 65%
      ),
      radial-gradient(
        ellipse 50% 45% at 72% 50%,
        var(--blue-800) 0%,
        transparent 65%
      ),
      var(--shade-950);
  }

  .yir-titles-wrapper {
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .yir-titles {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: radial-gradient(
      circle,
      var(--shade-900) 20%,
      var(--shade-950) 80%
    );
    padding-inline: var(--ni-20);
    padding-block: calc(var(--ni-20) * 1.3);
    border-radius: var(--border-radius-l);
    box-shadow: 0 0 var(--ni-52) var(--shade-1000);

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
    border: var(--border-thickness-xs) solid var(--shade-10);
    background-color: var(--shade-10);
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
      color: var(--shade-10);
      text-decoration: none;
    }

    @include for-mobile {
      font-size: var(--ni-20);
    }
  }

  .yir-under-user {
    width: var(--ni-380);
    max-width: 100%;
    border-bottom: var(--border-thickness-xxs) dashed var(--shade-500);
    margin: var(--ni-24) auto var(--ni-6) auto;

    @include for-mobile {
      width: var(--ni-256);
    }
  }

  .yir-year {
    font-size: calc(var(--ni-180) * 0.7);
    font-weight: bold;
    margin: 0;
    line-height: 1;
    color: var(--shade-10);

    @include for-mobile {
      font-size: calc(var(--ni-104) * 0.7);
    }
  }

  .yir-subtitle {
    background-color: transparent;
    color: var(--shade-10);
    border: var(--border-thickness-xs) solid var(--shade-10);
    border-radius: var(--border-radius-l);
    display: block;
    width: 70%;
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
