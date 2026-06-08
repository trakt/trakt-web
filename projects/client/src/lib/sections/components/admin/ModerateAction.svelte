<script lang="ts">
  import { page } from "$app/state";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { variant }: { variant?: "primary" | "secondary" } = $props();
</script>

<RenderFor audience="director">
  <DropdownItem
    variant={variant ?? "primary"}
    onclick={() => {
      const { pathname } = page.url;
      globalThis.window.open(
        `${UrlBuilder.admin()}${pathname}`,
        "_blank",
        "noopener,noreferrer",
      );
    }}
    style="flat"
    color="default"
    label="Moderate"
  >
    Moderate
    {#snippet icon()}
      <GearIcon />
    {/snippet}
  </DropdownItem>
</RenderFor>
