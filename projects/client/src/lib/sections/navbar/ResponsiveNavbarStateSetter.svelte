<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { NavbarStateSetterProps } from "./models/NavbarStateSetterProps";
  import NavbarStateSetter from "./NavbarStateSetter.svelte";

  const { contentToggle, ...props }: NavbarStateSetterProps = $props();

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
</script>

<NavbarStateSetter {...props} contentToggle={$isDesktop ? contentToggle : null} />
