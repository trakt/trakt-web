<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { map } from "rxjs";
  import { m } from "$lib/paraglide/messages";
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  const {
    slug,
    year,
    coverImage,
  }: {
    slug: string;
    year: number;
    coverImage: string | Nil;
  } = $props();

  const profileQuery = $derived(
    useQuery(userProfileQuery({ slug })),
  );
  const profile = $derived(
    profileQuery.pipe(map(($q) => $q.data)),
  );

  const now = new Date();
  const isCurrentYear = $derived(year === now.getFullYear());
  const subtitle = $derived(isCurrentYear ? m.yir_title_year_to_date() : m.yir_title_year_in_review());

  const coverSrc = $derived(
    $profile?.cover?.url || coverImage || DEFAULT_COVER,
  );
</script>

<section class="yir-title-page">
  <div class="yir-cover-bg">
    <CrossOriginImage src={coverSrc} alt="" />
  </div>
  <div class="yir-titles-wrapper">
    <div class="yir-titles">
      {#if $profile}
        <div class="yir-user">
          <a href="/users/{slug}" class="yir-avatar-link">
            <div class="yir-avatar">
              <CrossOriginImage
                src={$profile.avatar.url}
                alt={$profile.name.full ?? slug}
              />
            </div>
          </a>
          <span class="yir-display-name">
            <a href="/users/{slug}">{$profile.name.full || $profile.username}</a>
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

  .yir-title-page {
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
    background: radial-gradient(circle, var(--shade-900) 20%, var(--shade-950) 80%);
    padding: var(--ni-20);
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
    font-size: 26px;

    a {
      color: var(--shade-10);
      text-decoration: none;
    }

    @include for-mobile {
      font-size: 20px;
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
    font-size: 180px;
    font-weight: normal;
    margin: 0;
    line-height: 1;
    color: var(--shade-10);

    @include for-mobile {
      font-size: 100px;
    }
  }

  .yir-subtitle {
    background-color: var(--shade-10);
    color: var(--shade-950);
    display: block;
    text-transform: uppercase;
    padding: var(--ni-8) var(--ni-16);
    letter-spacing: 3px;
    word-spacing: 5px;
    margin: 0;
    text-align: center;
    font-size: 18px;
    font-weight: normal;
    line-height: 1;
  }
</style>
