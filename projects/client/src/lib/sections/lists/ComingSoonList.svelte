<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import Button from "$lib/components/buttons/Button.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "./components/MediaItem.svelte";
  import { useComingSoon } from "./stores/useComingSoon";
  import { genreCompareFactory } from "./utils/genreCompareFactory";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type ComingSoonProps = {
    title: string;
  };

  const { title }: ComingSoonProps = $props();
  const type = "movie";

  const { list, isLoading } = useComingSoon(type);
  const { user } = useUser();

  const { compare } = $derived(
    genreCompareFactory($user?.genres ?? [], "asc", "year"),
  );
</script>

<SectionList
  items={$list.sort(compare)}
  {title}
  --height-section-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.coming_soon_empty()}</p>
      <Button
        href={UrlBuilder.movies()}
        label={m.navbar_link_movies_label()}
        style="ghost"
        variant="primary"
      >
        {m.navbar_link_movies()}
      </Button>
    {/if}
  {/snippet}
</SectionList>
