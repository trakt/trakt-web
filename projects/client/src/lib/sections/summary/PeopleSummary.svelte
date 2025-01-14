<script lang="ts">
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import ActorSummary from "./components/ActorSummary.svelte";

  const {
    person,
  }: {
    person: PersonSummary;
  } = $props();
</script>

<ActorSummary {person} />
