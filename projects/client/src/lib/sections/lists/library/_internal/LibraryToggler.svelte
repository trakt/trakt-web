<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { Library } from "../models/Library";

  const { current, options, set } = useToggler("library");

  const {
    value,
    withLinks = false,
  }: {
    value?: Library;
    withLinks?: boolean;
  } = $props();

  const activeValue: Library = $derived(value ?? $current.value);

  const togglerOptions = $derived(
    withLinks
      ? options.map((option) => ({
          ...option,
          href: UrlBuilder.library.me(option.value),
        }))
      : options,
  );
</script>

<Toggler
  value={activeValue}
  onChange={set}
  options={togglerOptions}
/>
