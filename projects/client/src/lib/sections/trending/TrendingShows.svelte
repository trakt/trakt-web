<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TrendingList from "$lib/sections/trending/TrendingList.svelte";
</script>

<TrendingList title={m.trending_now()} type="show" />
