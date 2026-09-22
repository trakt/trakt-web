<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { useLibrarySelection } from "../useLibrarySelection.ts";

  const {
    library,
    withLinks = false,
  }: {
    library: ReturnType<typeof useLibrarySelection>;
    withLinks?: boolean;
  } = $props();

  const selection = $derived(library.selection);

  const togglerOptions = $derived(
    withLinks
      ? $selection.options.map((option) => ({
          ...option,
          href: UrlBuilder.library.me(option.value),
        }))
      : $selection.options,
  );
</script>

{#if togglerOptions.length > 1}
  <Toggler
    value={$selection.value}
    onChange={library.set}
    options={togglerOptions}
  />
{/if}
