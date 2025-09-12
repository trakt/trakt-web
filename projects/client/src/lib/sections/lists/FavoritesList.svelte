<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import FavoriteAction from "../media-actions/favorite/FavoriteAction.svelte";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import { useFavoritesList } from "./stores/useFavoritesList";

  const { title, slug }: { title: string; slug: string } = $props();

  const { current: selectedType, set, options } = useToggler("media");

  const type = $derived($selectedType === "all" ? undefined : $selectedType);

  const { filterMap } = useFilter();
  const { list, isLoading } = $derived(
    useFavoritesList({
      type,
      slug,
      filter: $filterMap,
    }),
  );
  const defaultVariant = $derived(useDefaultCardVariant(type));

  const placeholderMessage = $derived.by(() => {
    switch ($selectedType) {
      case "movie":
        return m.list_placeholder_favorite_movies();
      case "show":
        return m.list_placeholder_favorite_shows();
      default:
        return m.list_placeholder_favorites();
    }
  });

  const { isMe } = $derived(useIsMe(slug));
  const cta = $derived({ type: "favorites" as const, mediaType: type });
</script>

<SectionList
  id={`favorites-list-${selectedType}-${slug}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet item(media)}
    <DefaultMediaItem type={media.item.type} media={media.item}>
      {#snippet popupActions()}
        <FavoriteAction
          style="dropdown-item"
          title={media.item.title}
          type={media.item.type}
          id={media.item.id}
        />
      {/snippet}
    </DefaultMediaItem>
  {/snippet}

  {#snippet ctaItem()}
    {#if $isMe}
      <CtaItem {cta} variant="card" />
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      {#if $isMe}
        <CtaItem {cta} variant="placeholder" />
      {:else}
        <p class="small secondary">
          {placeholderMessage}
        </p>
      {/if}
    {/if}
  {/snippet}

  {#snippet badge()}
    <Toggler value={$selectedType} onChange={set} {options} />
  {/snippet}
</SectionList>
