<script lang="ts">
  import { dev } from "$app/environment";
  import { page } from "$app/state";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { resolveEnvironmentUri } from "$lib/features/image/components/resolveEnvironmentUri";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { usePopularList } from "$lib/sections/lists/popular/usePopularList";
  import { useTrendingList } from "$lib/sections/lists/trending/useTrendingList";
  import { shuffle } from "$lib/utils/array/shuffle";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import DownloadIcon from "./DownloadIcon.svelte";

  const total = $derived(parseInt(page.url.searchParams.get("limit") ?? "70"));
  const type = $derived(
    page.url.searchParams.get("type") === "show" ? "show" : "movie",
  );
  const limit = $derived(Math.floor(total / 2));

  function unique<T extends { id: number }>(array: T[]) {
    return Array.from(new Set(array.map((item) => item.id))).map((id) =>
      array.find((item) => item.id === id),
    ) as T[];
  }

  const { list: trendingMedia } = $derived(
    useTrendingList({
      type,
      limit,
    }),
  );
  const { list: popularMedia } = $derived(
    usePopularList({
      type,
      limit,
    }),
  );

  const media = $derived(
    unique(shuffle([...$trendingMedia, ...$popularMedia])),
  );

  async function downloadImage(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = (await resolveEnvironmentUri(url)).uri;
    a.download = filename.replace(/ /g, "_").toLocaleLowerCase();
    a.target = "_blank";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
</script>

{#snippet download(label: string, onDownload: () => void)}
  {#if dev}
    <ActionButton {label} color="red" onclick={onDownload}>
      <DownloadIcon />
    </ActionButton>
  {/if}
{/snippet}

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title="Assets">
  <div class="asset-navigation">
    <Button
      href="/_design_system/assets?type=movie"
      color="red"
      style="flat"
      size="small"
      label="View movie assets"
    >
      Movie Assets

      {#snippet icon()}
        <MovieIcon />
      {/snippet}
    </Button>

    <Button
      href="/_design_system/assets?type=show"
      color="red"
      style="flat"
      size="small"
      label="View show assets"
    >
      Show Assets

      {#snippet icon()}
        <ShowIcon />
      {/snippet}
    </Button>
  </div>

  <SectionList
    id="assets-covers"
    title={`Covers (${media.length})`}
    items={media}
    --height-list="var(--ni-128)"
  >
    {#snippet item(media)}
      <CrossOriginImage src={media.cover.url.medium} alt={media.title} />
    {/snippet}

    {#snippet actions()}
      {@render download(`Download ${type} covers`, () => {
        media.forEach((media, index) => {
          setTimeout(() => {
            downloadImage(
              media.cover.url.medium,
              `${type}_${media.title}_cover.webp`,
            );
          }, index * 100);
        });
      })}
    {/snippet}
  </SectionList>

  <SectionList
    id="assets-posters"
    title={`Posters (${media.length})`}
    items={media}
    --height-list="var(--ni-180)"
  >
    {#snippet item(media)}
      <CrossOriginImage src={media.poster.url.thumb} alt={media.title} />
    {/snippet}

    {#snippet actions()}
      {@render download(`Download ${type} posters`, () => {
        media.forEach((media, index) => {
          setTimeout(() => {
            downloadImage(
              media.poster.url.medium,
              `${type}_${media.title}_poster.webp`,
            );
          }, index * 100);
        });
      })}
    {/snippet}
  </SectionList>

  <SectionList
    id="assets-logos"
    title={`Logos (${media.length})`}
    items={media}
    --height-list="var(--ni-180)"
  >
    {#snippet item(media)}
      <CrossOriginImage src={media.logo.url.medium} alt={media.title} />
    {/snippet}

    {#snippet actions()}
      {@render download(`Download ${type} logos`, () => {
        media.forEach((media, index) => {
          setTimeout(() => {
            downloadImage(
              media.logo.url.medium,
              `${type}_${media.title}_logo.webp`,
            );
          }, index * 100);
        });
      })}
    {/snippet}
  </SectionList>
</TraktPage>

<style>
  .asset-navigation {
    display: flex;
    justify-content: center;
  }

  .asset-navigation {
    :global(.trakt-button svg) {
      width: var(--ni-24);
    }
  }
</style>
