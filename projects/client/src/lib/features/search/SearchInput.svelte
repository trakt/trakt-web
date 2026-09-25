<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import SearchField from "$lib/components/form/SearchField.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import { onMount } from "svelte";
  import { useSearch } from "./useSearch";

  type SearchInputProps = {
    variant?: "default" | "embedded";
  };

  const { variant = "default" }: SearchInputProps = $props();

  const { clear, isSearching, pathName, mode, query } = useSearch();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  function onSearch(ev: Event) {
    const inputElement = ev.target as HTMLInputElement;
    const value = inputElement.value.trim();

    if (value.length === 0) {
      goto(pathName, {
        replaceState: page.url.pathname === pathName,
        keepFocus: true,
      });
    }

    const params = buildParamString({
      m: $mode,
      q: inputElement.value.trim(),
    });
    goto(`${pathName}${params}`, {
      replaceState: page.url.pathname === pathName,
      keepFocus: true,
    });
  }

  let inputElement = $state<HTMLInputElement>();

  const placeholder = $derived.by(() => {
    switch ($mode) {
      case "media":
        return m.input_placeholder_search();
      case "movie":
        return m.input_placeholder_search_movies();
      case "show":
        return m.input_placeholder_search_shows();
      case "people":
        return m.input_placeholder_search_people();
      case "lists":
        return m.input_placeholder_search_lists();
    }
  });

  onMount(() => {
    if (!$isMouse || !inputElement) {
      return;
    }

    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
    inputElement.focus();

    if (length > 0) {
      inputElement.click();
    }
  });
</script>

<SearchField
  bind:inputElement
  {variant}
  {placeholder}
  defaultValue={$query}
  isLoading={$isSearching}
  onclick={onSearch}
  oninput={onSearch}
  onclickoutside={clear}
/>
