<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MixtapeDoneProps } from "./MixtapeDoneProps.ts";
  import MixtapePicks from "./MixtapePicks.svelte";
  import MixtapeSavedTo from "./MixtapeSavedTo.svelte";
  import { toNewestRounds } from "./toNewestRounds.ts";

  const {
    rounds,
    picked,
    savedTo,
    closeHref,
    changeHref,
    startOverHref,
    onMore,
    onMoved,
  }: MixtapeDoneProps = $props();

  const kept = $derived(rounds.flat());
  const newestFirst = $derived(toNewestRounds(rounds));
  const isMultiRound = $derived(newestFirst.length > 1);
</script>

<div class="trakt-mixtape-done">
  <header class="done-header">
    <div class="done-heading">
      <h2>{m.header_mixtape_done()}</h2>
      <p class="small secondary">
        {kept.length === 1
          ? m.text_mixtape_count_one()
          : m.text_mixtape_count({ count: kept.length })}
      </p>
    </div>
    <Link href={closeHref} color="inherit" label={m.button_label_close()}>
      <span class="done-close"><CloseIcon /></span>
    </Link>
  </header>

  <MixtapePicks {picked} />

  {#if kept.length > 0}
    <MixtapeSavedTo {kept} {picked} {savedTo} {onMoved} />

    <div class="done-rounds">
      {#each newestFirst as { media, round }, index (round)}
        {#if isMultiRound}
          <p class="done-round small secondary">
            {m.text_mixtape_round({ round })}
          </p>
        {/if}
        <div class="done-thumbs">
          {#each media as item (item.id)}
            <div class="done-cover">
              <CrossOriginImage
                src={item.poster.url.medium}
                alt={m.image_alt_media_poster({ title: item.title })}
              />
              {#if isMultiRound && index === 0}
                <span class="done-new">{m.tag_text_new()}</span>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {:else}
    <p class="secondary">{m.text_mixtape_results_empty()}</p>
  {/if}

  <span class="done-spacer"></span>

  <div class="done-buttons">
    <div class="done-row">
      {#if onMore}
        <Button
          color="purple"
          label={m.button_text_mixtape_show_more()}
          onclick={onMore}
        >
          {m.button_text_mixtape_show_more()}
        </Button>
      {/if}
      <Button
        href={closeHref}
        variant="secondary"
        label={m.button_text_mixtape_finish()}
      >
        {m.button_text_mixtape_finish()}
      </Button>
    </div>
    <div class="done-row">
      <Button
        href={changeHref}
        variant="secondary"
        style="ghost"
        label={m.button_text_mixtape_change_picks()}
      >
        {m.button_text_mixtape_change_picks()}
      </Button>
      <Button
        href={startOverHref}
        variant="secondary"
        style="ghost"
        label={m.button_text_mixtape_start_over()}
      >
        {m.button_text_mixtape_start_over()}
      </Button>
    </div>
  </div>
</div>


<style lang="scss">
  .trakt-mixtape-done {
    container: mixtape-done / inline-size;
    position: relative;
    box-sizing: border-box;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    padding: var(--gap-s) var(--gap-m) var(--gap-l);
    padding-block-start: calc(var(--gap-s) + env(safe-area-inset-top));
    padding-block-end: calc(var(--gap-l) + env(safe-area-inset-bottom));

    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
      var(--color-background) 60%
    );

    p,
    h2 {
      margin: 0;
    }
  }

  .done-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .done-heading {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .done-close {
    display: grid;
    place-items: center;
    width: var(--ni-44);
    height: var(--ni-44);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .done-rounds {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    overflow-y: auto;
  }

  .done-round {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    &::after {
      content: "";
      flex: 1;
      border-block-start: var(--border-thickness-xxs) solid var(--color-border);
    }
  }

  .done-new {
    position: absolute;
    inset-block-start: var(--ni-6);
    inset-inline-start: var(--ni-6);
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--purple-50);
    font-size: var(--font-size-tag);
    font-weight: 700;
  }

  .done-thumbs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
  }

  .done-cover {
    position: relative;
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @container mixtape-done (width > 40rem) {
    .done-thumbs {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }

    .done-buttons {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .done-spacer {
    flex: 1;
  }

  .done-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    :global(.trakt-button) {
      width: 100%;
    }
  }

  .done-row {
    display: flex;
    gap: var(--gap-s);

    > :global(*) {
      flex: 1;
    }
  }
</style>
