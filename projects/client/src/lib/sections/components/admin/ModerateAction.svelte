<script lang="ts">
  import { page } from "$app/state";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<RenderFor audience="director">
  <DropdownItem
    onclick={() => {
      const { pathname } = page.url;
      globalThis.window.open(
        `${UrlBuilder.admin()}${pathname}`,
        "_blank",
        "noopener,noreferrer",
      );
    }}
    label="Moderate"
  >
    Moderate
    {#snippet icon()}
      <GearIcon />
    {/snippet}
  </DropdownItem>
</RenderFor>
