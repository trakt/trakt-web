<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { ViewListLinkProps } from "./ViewListLinkProps";

  const { href, label, tooltip }: ViewListLinkProps = $props();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);
</script>

<Tooltip content={tooltip} variant="compact" disabled={!$isMouse}>
  <Link {href} {label} color="inherit">
    <CaretRightIcon />
  </Link>
</Tooltip>
