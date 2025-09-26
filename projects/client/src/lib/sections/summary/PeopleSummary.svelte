<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import CreditsList from "../lists/CreditsList.svelte";
  import PeopleSummary from "./components/people/PeopleSummary.svelte";
  import PeopleSummaryV2 from "./components/people/v2/PeopleSummary.svelte";

  const {
    person,
  }: {
    person: PersonSummary;
  } = $props();
</script>

<RenderFor audience="all" device={["mobile"]}>
  <PeopleSummaryV2 {person} />
</RenderFor>

<RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
  <PeopleSummary {person} />
</RenderFor>

<CreditsList title={m.list_title_movie_credits()} type="movie" {person} />
<CreditsList title={m.list_title_show_credits()} type="show" {person} />
