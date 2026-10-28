<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import { mapToMainCredit } from "../../../_internal/mapToMainCredit.ts";

  /*
    "Directed by <name>" for films, "Created by <name>" for shows - the label
    switches on media type inside mapToMainCredit, which the existing header
    already uses, so the two stay in step.

    `stacked` sets the role on its own line above the name. The masthead's credits
    column uses it to gain vertical lines, so the three columns of its strip end up
    a comparable height instead of the credits column sitting half-empty.
  */
  const {
    type,
    crew,
    layout = "inline",
  }: {
    type: ExtendedMediaType;
    crew: MediaCrew;
    layout?: "inline" | "stacked";
  } = $props();

  const mainCredit = $derived(mapToMainCredit(type, crew));
</script>

{#if mainCredit}
  {#if layout === "stacked"}
    <div class="trakt-summary-header-byline" data-layout="stacked">
      <span class="byline-role">{mainCredit.label}</span>
      <span class="byline-names">
        <Link
          href={UrlBuilder.people(mainCredit.key, mainCredit.positions)}
          target="_self">{mainCredit.name}</Link
        >{#if mainCredit.others?.[0]}<span class="byline-separator">, </span
          ><Link
            href={UrlBuilder.people(
              mainCredit.others[0].key,
              mainCredit.positions,
            )}
            target="_self">{mainCredit.others[0].name}</Link
          >{/if}
      </span>
    </div>
  {:else}
    <p class="trakt-summary-header-byline" data-layout="inline">
      <MessageWithLink
        message={mainCredit.text}
        href={UrlBuilder.people(mainCredit.key, mainCredit.positions)}
        target="_self"
      />{#if mainCredit.others?.[0]}<span class="byline-separator">, </span
        ><Link
          href={UrlBuilder.people(
            mainCredit.others[0].key,
            mainCredit.positions,
          )}
          target="_self">{mainCredit.others[0].name}</Link
        >{/if}
    </p>
  {/if}
{/if}

<style lang="scss">
  .trakt-summary-header-byline {
    font-size: var(--byline-size, var(--ni-16));
    color: var(--color-text-secondary);

    margin: 0;

    &[data-layout="stacked"] {
      display: flex;
      flex-direction: column;
      gap: var(--ni-2);
    }

    :global(.trakt-link) {
      color: var(--color-text-primary);
      font-weight: 600;
      text-underline-offset: var(--ni-3);
      text-decoration-thickness: var(--ni-1);
    }
  }

  .byline-role {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
  }
</style>
