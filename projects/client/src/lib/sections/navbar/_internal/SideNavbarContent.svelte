<script lang="ts">
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import NavGroup from "./NavGroup.svelte";

  const {
    isCollapsed,
  }: {
    isCollapsed: boolean;
  } = $props();

  const { current } = useToggler("discover");
</script>

{#snippet iconSearch()}<SearchIcon />{/snippet}
{#snippet iconHome()}<HomeIcon />{/snippet}
{#snippet iconDiscover()}<DiscoverIcon />{/snippet}
{#snippet iconList()}<ListIcon />{/snippet}

{#snippet navSubLink(href: string, title: string)}
  <Link {href} label={title}>
    <span>{title}</span>
  </Link>
{/snippet}

<div class="trakt-side-navbar-content" class:is-expanded={!isCollapsed}>
  <RenderFor audience="authenticated">
    <NavGroup
      href={UrlBuilder.search()}
      label={m.button_label_search()}
      title={m.page_title_search()}
      icon={iconSearch}
      {isCollapsed}
    />
  </RenderFor>

  <NavGroup
    href={UrlBuilder.home()}
    label={m.button_label_home()}
    title={m.page_title_home()}
    icon={iconHome}
    {isCollapsed}
  >
    <RenderFor audience="authenticated">
      {@render navSubLink(UrlBuilder.progress("me"), m.list_title_up_next())}
      {@render navSubLink(UrlBuilder.calendar(), m.page_title_calendar())}
    </RenderFor>
  </NavGroup>

  <RenderFor audience="authenticated">
    <NavGroup
      href={UrlBuilder.discover()}
      label={m.button_label_discover()}
      title={m.page_title_discover()}
      icon={iconDiscover}
      {isCollapsed}
    >
      {@render navSubLink(
        UrlBuilder.trending({ type: $current.value }),
        m.list_title_trending(),
      )}
      {@render navSubLink(
        UrlBuilder.recommended({ type: $current.value }),
        m.list_title_recommended(),
      )}
      {@render navSubLink(
        UrlBuilder.anticipated({ type: $current.value }),
        m.list_title_most_anticipated(),
      )}
      {@render navSubLink(
        UrlBuilder.popular({ type: $current.value }),
        m.list_title_most_popular(),
      )}
    </NavGroup>

    <NavGroup
      href={UrlBuilder.lists.user("me")}
      label={m.button_label_browse_lists()}
      title={m.page_title_lists()}
      icon={iconList}
      {isCollapsed}
    >
      {@render navSubLink(
        UrlBuilder.lists.watchlist("me"),
        m.page_title_watchlist(),
      )}
    </NavGroup>
  </RenderFor>
</div>

<style>
  .trakt-side-navbar-content {
    --nav-icon-size: var(--ni-24);
    --content-align: center;
    --content-gap: var(--gap-l);
    --content-bg: var(--color-background-side-navbar);
    --content-radius: var(--ni-60);
    --content-shadow: var(--shadow-navbar);
    --content-padding: var(--ni-10) 0;

    display: flex;
    flex-direction: column;
    align-items: var(--content-align);
    align-self: center;
    gap: var(--content-gap);

    width: var(--side-navbar-width);

    background-color: var(--content-bg);
    box-shadow: var(--content-shadow);

    border-radius: var(--content-radius);
    padding: var(--content-padding);

    &.is-expanded {
      --content-align: flex-start;
      --content-gap: var(--gap-m);
      --content-bg: transparent;
      --content-radius: 0;
      --content-shadow: none;
      --content-padding: var(--ni-10) var(--ni-12);

      width: var(--side-navbar-width-expanded);
      align-self: stretch;
      box-sizing: border-box;
    }
  }
</style>
