<script lang="ts">
  import FilterIcon from "$lib/components/icons/FilterIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<div class="trakt-filtered-placeholder">
  <FilterIcon state="filtered" />
  <p>{m.list_placeholder_no_filter_results()}</p>
</div>

<style>
  .trakt-filtered-placeholder {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
  }
</style>
