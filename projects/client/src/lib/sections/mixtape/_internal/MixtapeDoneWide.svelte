<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import type { MixtapeDoneWideProps } from "./MixtapeDoneWideProps.ts";
  import MixtapeSavedTo from "./MixtapeSavedTo.svelte";
  import { toMixtapeMeta } from "./toMixtapeMeta.ts";
  import { toMixtapeTotals } from "./toMixtapeTotals.ts";
  import { toNewestRounds } from "./toNewestRounds.ts";
  import { toPickedLine } from "./toPickedLine.ts";

  const SPREAD_SIZE = 6;
  const BACKDROP_SIZE = 3;

  const {
    rounds,
    picked,
    savedTo,
    closeHref,
    changeHref,
    startOverHref,
    onMore,
    onMoved,
    matchOf,
  }: MixtapeDoneWideProps = $props();

  const kept = $derived(rounds.flat());
  const newestFirst = $derived(toNewestRounds(rounds));
  const isMultiRound = $derived(newestFirst.length > 1);
  const spread = $derived(kept.slice(-SPREAD_SIZE));
  const backdrops = $derived(newestFirst.at(0)?.media.slice(0, BACKDROP_SIZE) ?? []);
  const totals = $derived(toMixtapeTotals(kept, matchOf));
</script>

<div class="trakt-mixtape-done-wide">
  <div class="wide-backdrop" aria-hidden="true">
    {#each backdrops as media (media.id)}
      <CrossOriginImage src={media.cover.url.medium} alt="" />
    {/each}
  </div>

  <span class="wide-close">
    <Link href={closeHref} color="inherit" label={m.button_label_close()}>
      <span class="wide-close-icon"><CloseIcon /></span>
    </Link>
  </span>

  <div class="wide-layout">
    <section class="wide-summary">
      <div
        class="wide-spread"
        style:--spread-count={spread.length}
        aria-hidden="true"
      >
        {#each spread as media, index (media.id)}
          <div class="wide-spread-poster" style:--spread-index={index}>
            <CrossOriginImage src={media.poster.url.medium} alt="" />
          </div>
        {/each}
      </div>

      <p class="tag uppercase bold secondary">
        {toPickedLine(picked.map(({ title }) => title))}
      </p>
      <h1>{m.header_mixtape_done()}</h1>

      <dl class="wide-stats">
        <div>
          <dt class="visually-hidden">{m.text_mixtape_stat_titles_label()}</dt>
          <dd class="bold">
            {kept.length === 1
              ? m.text_mixtape_count_one()
              : m.text_mixtape_count({ count: kept.length })}
          </dd>
        </div>
        {#if totals.minutes}
          <div>
            <dt class="small secondary">{m.text_mixtape_stat_runtime_label()}</dt>
            <dd class="bold">
              {toHumanDuration({ minutes: totals.minutes }, languageTag())}
            </dd>
          </div>
        {/if}
        {#if totals.match != null}
          <div>
            <dt class="small secondary">{m.text_mixtape_stat_match_label()}</dt>
            <dd class="bold">{toPercentage(totals.match / 100, languageTag())}</dd>
          </div>
        {/if}
      </dl>

      {#if kept.length > 0}
        <MixtapeSavedTo
          {kept}
          {picked}
          {savedTo}
          {onMoved}
          --width-mixtape-saved="fit-content"
        />
      {/if}

      <div class="wide-actions">
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
    </section>

    <section class="wide-list">
      {#if kept.length === 0}
        <p class="secondary">{m.text_mixtape_results_empty()}</p>
      {/if}
      {#each newestFirst as { media, round }, index (round)}
        {#if isMultiRound}
          <p class="wide-round small secondary">
            {m.text_mixtape_round({ round })}
          </p>
        {/if}
        <ul class="wide-rows">
          {#each media as item (item.id)}
            {@const match = matchOf(item.id)}
            <li class="wide-row">
              <span class="wide-row-poster">
                <CrossOriginImage
                  src={item.poster.url.thumb}
                  alt={m.image_alt_media_poster({ title: item.title })}
                />
              </span>
              <span class="wide-row-text">
                <span class="bold ellipsis">{item.title}</span>
                <span class="small secondary ellipsis">
                  {toMixtapeMeta(item)}
                </span>
              </span>
              {#if isMultiRound && index === 0}
                <span class="wide-new">{m.tag_text_new()}</span>
              {/if}
              {#if match != null}
                <span class="wide-match">
                  {toPercentage(match / 100, languageTag())}
                </span>
              {/if}
            </li>
          {/each}
        </ul>
      {/each}
    </section>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-done-wide {
    position: relative;
    overflow: hidden;
    min-height: var(--ni-640);
    border-radius: var(--border-radius-xl);
    background: var(--color-background);

    p,
    h1,
    dl,
    dd {
      margin: 0;
    }

    .visually-hidden {
      @include visually-hidden;
    }
  }

  .wide-backdrop {
    position: absolute;
    inset: 0;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.34;
      filter: blur(var(--ni-32)) saturate(1.2);
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          calc(90deg * var(--rtl-sign)),
          color-mix(in srgb, var(--color-background) 35%, transparent),
          color-mix(in srgb, var(--color-background) 92%, transparent) 52%
        ),
        linear-gradient(180deg, transparent 60%, var(--color-background));
    }
  }

  .wide-close {
    position: absolute;
    inset-block-start: var(--gap-m);
    inset-inline-end: var(--gap-l);
    z-index: var(--layer-raised);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .wide-close-icon {
    display: grid;
    place-items: center;
    width: var(--ni-40);
    height: var(--ni-40);

    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .wide-layout {
    position: relative;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, var(--ni-520)) minmax(0, 1fr);
    gap: var(--ni-44);
    padding: var(--ni-28) var(--ni-40);

    @include for-tablet-lg-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-32);
      padding-inline: var(--ni-24);
    }
  }

  .wide-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    h1 {
      font-size: var(--ni-44);
      line-height: 1.05;
      letter-spacing: -0.02em;
    }
  }

  .wide-spread {
    --spread-anchor: var(--ni-180);
    --spread-poster-width: var(--ni-160);
    --spread-step: var(--ni-64);

    position: relative;
    height: var(--ni-320);

    @include for-tablet-lg-and-below {
      --spread-anchor: calc(50% - var(--spread-poster-width) / 2);
      --spread-poster-width: var(--ni-120);
      --spread-step: var(--ni-48);

      height: var(--ni-240);
    }
  }

  .wide-spread-poster {
    --spread-offset: calc(var(--spread-index) - (var(--spread-count) - 1) / 2);

    position: absolute;
    inset-block-end: var(--ni-20);
    inset-inline-start: calc(
      var(--spread-anchor) + var(--spread-offset) * var(--spread-step)
    );
    width: var(--spread-poster-width);
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border-radius: var(--border-radius-l);
    box-shadow:
      0 var(--ni-24) var(--ni-48) color-mix(in srgb, black 60%, transparent),
      0 0 0 var(--border-thickness-xxs) var(--color-border);
    transform: rotate(calc(var(--rtl-sign) * var(--spread-offset) * 5deg));

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .wide-stats {
    display: flex;
    align-items: baseline;
    gap: var(--gap-l);

    > div {
      display: flex;
      flex-direction: column-reverse;
      gap: var(--ni-2);
    }

    dd {
      font-size: var(--ni-22);
    }
  }

  .wide-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs);
    margin-block-start: var(--gap-s);
  }

  .wide-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding-block-start: var(--ni-56);
    min-width: 0;

    @include for-tablet-lg-and-below {
      padding-block-start: 0;
    }
  }

  .wide-round {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    margin-block-start: var(--gap-xs);

    &::after {
      content: "";
      flex: 1;
      border-block-start: var(--border-thickness-xxs) solid var(--color-border);
    }
  }

  .wide-rows {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .wide-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding-block: var(--ni-8);
    padding-inline-start: var(--ni-8);
    padding-inline-end: var(--ni-12);

    border-radius: var(--border-radius-l);
    background: color-mix(in srgb, var(--color-card-background) 72%, transparent);
    box-shadow: 0 0 0 var(--border-thickness-xxs) var(--color-border);
  }

  .wide-row-poster {
    flex: none;
    width: var(--ni-44);
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-xs);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .wide-row-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    flex: 1;
    min-width: 0;
  }

  .wide-new {
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--purple-50);
    font-size: var(--font-size-tag);
    font-weight: 700;
  }

  .wide-match {
    padding: var(--ni-4) var(--ni-10);
    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    font-size: var(--font-size-text-small);
    font-weight: 700;
  }
</style>
