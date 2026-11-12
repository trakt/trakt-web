<script lang="ts">
  import { getIntlLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DocumentaryCheck } from "$lib/requests/models/DocumentaryCheck.ts";

  const { makers }: { makers: DocumentaryCheck["makers"] } = $props();

  const toList = (names: ReadonlyArray<string>) =>
    new Intl.ListFormat(getIntlLocale(languageTag()), {
      type: "conjunction",
    }).format(names);

  const line = $derived(
    [
      makers.madeBy.length > 0
        ? m.text_documentary_made_by({ names: toList(makers.madeBy) })
        : null,
      makers.fundedBy.length > 0
        ? m.text_documentary_funded_by({ names: toList(makers.fundedBy) })
        : null,
    ]
      .filter((part) => part !== null)
      .join(" "),
  );
</script>

{#if line}
  <div class="trakt-documentary-makers">
    <p class="small secondary">{line}</p>
  </div>
{/if}

<style>
  .trakt-documentary-makers p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--makers-max-lines, none);
    line-clamp: var(--makers-max-lines, none);
    overflow: hidden;
  }
</style>
