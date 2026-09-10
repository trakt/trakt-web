<script lang="ts">
  import type { PersonSummary } from "$lib/requests/models/PersonSummary.ts";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";

  const { person }: { person: PersonSummary } = $props();

  const description = $derived(
    person.knownFor ? toTranslatedPosition(person.knownFor) : "",
  );
</script>

<CreditMemberItem
  member={{
    key: person.slug,
    name: person.name,
    headshot: person.headshot,
    description,
  }}
/>
