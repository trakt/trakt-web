<script lang="ts">
  import type { NavbarStateSetterProps } from "./models/NavbarStateSetterProps";
  import NavbarStateSetter from "./NavbarStateSetter.svelte";

  const props: NavbarStateSetterProps = $props();
</script>

<NavbarStateSetter {...props} />
