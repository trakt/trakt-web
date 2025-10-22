<script lang="ts">
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ReleasedIcon from "../icons/ReleasedIcon.svelte";
  import type { ListCta } from "../models/Cta";
  import PlaceholderItem from "./PlaceholderItem.svelte";

  const { intl, cta }: { intl: CtaItemIntl; cta: ListCta } = $props();
</script>

<PlaceholderItem {cta} {intl}>
  {#snippet icon()}
    <ReleasedIcon />
  {/snippet}
</PlaceholderItem>
