<script lang="ts">
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ReleasedIcon from "../icons/ReleasedIcon.svelte";
  import type { Cta } from "../models/Cta";
  import PlaceholderItem from "./PlaceholderItem.svelte";

  const { intl }: { intl: CtaItemIntl } = $props();

  const cta: Cta = { type: "personal-list" };
</script>

<PlaceholderItem {cta} {intl}>
  {#snippet icon()}
    <ReleasedIcon />
  {/snippet}
</PlaceholderItem>
