<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import AnticipatedList from "./AnticipatedList.svelte";
</script>

<AnticipatedList title={m.most_anticipated()} type="show" />
