<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import CreditsList from "../lists/CreditsList.svelte";
  import ActorSummary from "./components/ActorSummary.svelte";

  const {
    person,
  }: {
    person: PersonSummary;
  } = $props();
</script>

<ActorSummary {person} />

<CreditsList title={m.movies()} type="movie" slug={person.slug} />
<CreditsList title={m.shows()} type="show" slug={person.slug} />
