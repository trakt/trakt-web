<script lang="ts">
  import type { NavbarStateSetterProps } from "./models/NavbarStateSetterProps";
  import NavbarStateSetter from "./NavbarStateSetter.svelte";

  // The desktop Media/Shows/Movies toggle this wrapper used to inject now lives
  // as one persistent, route-driven instance in NavbarActions, so this is a thin
  // passthrough - kept to avoid churning its 16 call sites.
  const props: NavbarStateSetterProps = $props();
</script>

<NavbarStateSetter {...props} />
