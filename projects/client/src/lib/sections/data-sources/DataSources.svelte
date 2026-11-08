<script lang="ts">
  import JustWatchIcon from "$lib/components/icons/JustWatchIcon.svelte";
  import TMDBIcon from "$lib/components/icons/TMDBIcon.svelte";
  import WikipediaIcon from "$lib/components/icons/WikipediaIcon.svelte";
  import LegalPage from "$lib/components/legal/LegalPage.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const sources = [
    {
      key: "tmdb",
      name: "TMDB",
      logo: TMDBIcon,
      use: m.text_data_sources_tmdb,
      href: UrlBuilder.external.tmdb.home(),
    },
    {
      key: "justwatch",
      name: "JustWatch",
      logo: JustWatchIcon,
      use: m.text_data_sources_justwatch,
      href: UrlBuilder.external.justWatch(),
    },
    {
      key: "wikipedia",
      name: "Wikipedia",
      logo: WikipediaIcon,
      use: m.text_data_sources_wikipedia,
      href: UrlBuilder.external.wikipediaHome(),
    },
  ];

  const toDomain = (href: string) => new URL(href).hostname.replace("www.", "");
</script>

<LegalPage title={m.page_title_data_sources()} lastUpdated="November 9, 2026">
  {#snippet intro()}
    <div class="trakt-data-sources">
      <span class="secondary">{m.text_data_sources_intro()}</span>

      <div class="source-grid">
        {#each sources as source (source.key)}
          <div class="source-card">
            <div class="source-logo">
              <source.logo />
            </div>
            <div class="source-details">
              <span class="bold">{source.name}</span>
              <span class="small secondary">{source.use()}</span>
              <Link
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                <span class="small">{toDomain(source.href)}</span>
              </Link>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/snippet}

  {#snippet summary()}
    <span>{m.text_data_sources_tmdb_notice()}</span>
  {/snippet}
</LegalPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-data-sources {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    .source-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--gap-m);

      @include for-tablet-sm-and-below {
        grid-template-columns: 1fr;
      }
    }

    .source-card {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);

      padding: var(--gap-m);
      border-radius: var(--border-radius-l);
      background: var(--color-card-background);
      box-shadow: var(--shadow-floating);

      @include for-tablet-sm-and-below {
        flex-direction: row;
        align-items: flex-start;
      }
    }

    .source-logo {
      flex-shrink: 0;
      display: grid;
      place-items: center;

      width: var(--ni-48);
      height: var(--ni-48);
      border-radius: var(--border-radius-m);
      background: var(--color-background);

      :global(svg) {
        width: var(--ni-28);
        height: var(--ni-28);
      }
    }

    .source-details {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
      min-width: 0;
      line-height: 1.4;
    }
  }
</style>
