<script lang="ts">
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import SearchModeToggles from "$lib/features/search/SearchModeToggles.svelte";
  import { fade } from "svelte/transition";
</script>

<div class="trakt-mobile-navbar-search" in:fade={{ duration: 150, delay: 150 }}>
  <SearchModeToggles />
  <SearchInput />
</div>

<style>
  .trakt-mobile-navbar-search {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    padding: var(--ni-4) var(--ni-20);
    box-sizing: border-box;

    gap: var(--gap-s);
  }
</style>
