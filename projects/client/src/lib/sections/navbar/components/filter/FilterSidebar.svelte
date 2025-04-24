<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Writable } from "svelte/store";
  import Sidebar from "./_internal/Sidebar.svelte";
  import GenreDropdown from "./filters/GenreDropdown.svelte";

  const { isOpen }: { isOpen: Writable<boolean> } = $props();
</script>

<Sidebar {isOpen} title={m.filters_title()}>
  <GenreDropdown />
</Sidebar>
