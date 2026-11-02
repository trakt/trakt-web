<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { MixtapeFinaleProps } from "./MixtapeFinaleProps.ts";
  import MixtapeSavedTo from "./MixtapeSavedTo.svelte";
  import { toMixtapeMeta } from "./toMixtapeMeta.ts";
  import { toMixtapeTotals } from "./toMixtapeTotals.ts";
  import { toNewestRounds } from "./toNewestRounds.ts";

  const FAN_SIZE = 3;

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
    becauseOf,
  }: MixtapeFinaleProps = $props();

  const kept = $derived(rounds.flat());
  const newestFirst = $derived(toNewestRounds(rounds));
  const isMultiRound = $derived(newestFirst.length > 1);
  const fan = $derived(kept.slice(-FAN_SIZE));
  const totals = $derived(toMixtapeTotals(kept, matchOf));
  const kicker = $derived(
    picked.length === 1
      ? m.text_mixtape_mixed_from_picks_one()
      : m.text_mixtape_mixed_from_picks({ count: picked.length }),
  );

  const fanDepth = (index: number) =>
    fan.length - Math.abs(index - (fan.length - 1) / 2) * 2;
</script>

<div class="trakt-mixtape-finale">
  <div class="finale-layout">
    <section class="finale-summary">
      <div class="finale-fan" style:--fan-count={fan.length} aria-hidden="true">
        {#each fan as media, index (media.id)}
          <span
            class="finale-fan-poster"
            style:--fan-index={index}
            style:--fan-depth={fanDepth(index)}
          >
            <CrossOriginImage src={media.poster.url.medium} alt="" />
          </span>
        {/each}
      </div>

      <p class="tag uppercase bold secondary">{kicker}</p>
      <h1 class="finale-title">{m.header_mixtape_done()}</h1>

      <dl class="finale-stats">
        <div class="finale-stat">
          <dt class="tag uppercase bold secondary">
            {m.text_mixtape_stat_titles_label()}
          </dt>
          <dd>{kept.length}</dd>
        </div>
        {#if totals.minutes}
          <div class="finale-stat">
            <dt class="tag uppercase bold secondary">
              {m.text_mixtape_stat_runtime_label()}
            </dt>
            <dd>
              {toHumanDuration({ minutes: totals.minutes }, languageTag())}
            </dd>
          </div>
        {/if}
        {#if totals.match != null}
          <div class="finale-stat">
            <dt class="tag uppercase bold secondary">
              {m.text_mixtape_stat_match_label()}
            </dt>
            <dd>{toPercentage(totals.match / 100, languageTag())}</dd>
          </div>
        {/if}
      </dl>

      {#if kept.length > 0}
        <MixtapeSavedTo {kept} {picked} {savedTo} {onMoved} />
      {/if}

      <div class="finale-actions">
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

      <div class="finale-links">
        <Button
          href={changeHref}
          variant="secondary"
          style="ghost"
          size="small"
          label={m.button_text_mixtape_change_picks()}
        >
          {m.button_text_mixtape_change_picks()}
        </Button>
        <span class="finale-divider" aria-hidden="true"></span>
        <Button
          href={startOverHref}
          variant="secondary"
          style="ghost"
          size="small"
          label={m.button_text_mixtape_start_over()}
        >
          {m.button_text_mixtape_start_over()}
        </Button>
      </div>
    </section>

    <section class="finale-list">
      <p class="tag uppercase bold secondary">{m.header_mixtape_list()}</p>
      {#if kept.length === 0}
        <p class="secondary">{m.text_mixtape_results_empty()}</p>
      {/if}
      {#each newestFirst as { media, round }, roundIndex (round)}
        {#if isMultiRound}
          <p class="finale-round small secondary">
            {m.text_mixtape_round({ round })}
          </p>
        {/if}
        <ol class="finale-rows">
          {#each media as item, index (item.id)}
            {@const match = matchOf(item.id)}
            {@const because = becauseOf(item.id)}
            <li class="finale-row" style:--row-index={index}>
              <span class="finale-row-number">{index + 1}</span>
              <span class="finale-row-link">
                <Link
                  href={UrlBuilder.media(item.type, item.slug)}
                  color="inherit"
                  label={item.title}
                >
                  <span class="finale-row-poster">
                    <CrossOriginImage
                      src={item.poster.url.thumb}
                      alt={m.image_alt_media_poster({ title: item.title })}
                    />
                  </span>
                  <span class="finale-row-text">
                    <span class="bold ellipsis">{item.title}</span>
                    <span class="small secondary ellipsis">
                      {toMixtapeMeta(item)}
                    </span>
                    {#if because}
                      <span class="tag uppercase bold secondary ellipsis">
                        {m.text_mixtape_because({ title: because })}
                      </span>
                    {/if}
                  </span>
                </Link>
              </span>
              {#if isMultiRound && roundIndex === 0}
                <span class="finale-new">{m.tag_text_new()}</span>
              {/if}
              {#if match != null}
                <span class="finale-row-match bold">
                  {m.tag_mixtape_match({ match: String(match) })}
                </span>
              {/if}
            </li>
          {/each}
        </ol>
      {/each}
    </section>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-finale {
    --finale-fan-width: var(--ni-148);
    --finale-fan-step: var(--ni-72);
    --finale-fan-tilt: 9deg;
    --finale-poster-width: var(--ni-56);

    container: mixtape-finale / inline-size;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: calc(var(--ni-920) + var(--ni-120));
    margin-inline: auto;
    padding: var(--ni-32) var(--ni-24) var(--ni-40);

    p,
    h1,
    dl,
    dt,
    dd,
    ol {
      margin: 0;
    }
  }

  /*
    The grid lives one level down: a container query cannot size the
    container itself, so the root measures and the layout responds.
  */
  .finale-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-32);
  }

  .finale-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);
    text-align: center;
  }

  .finale-fan {
    position: relative;
    width: calc(var(--finale-fan-width) + 2 * var(--finale-fan-step));
    height: calc(var(--finale-fan-width) * 1.5 + var(--ni-24));
    margin-block-end: var(--gap-xs);
  }

  .finale-fan-poster {
    --fan-slot: calc(var(--fan-index) - (var(--fan-count) - 1) / 2);
    --fan-transform: translateX(
        calc(var(--rtl-sign, 1) * var(--fan-slot) * var(--finale-fan-step))
      )
      rotate(
        calc(var(--rtl-sign, 1) * var(--fan-slot) * var(--finale-fan-tilt))
      );

    position: absolute;
    inset-block-start: var(--ni-10);
    inset-inline-start: 50%;
    z-index: var(--fan-depth);
    width: var(--finale-fan-width);
    aspect-ratio: 2 / 3;
    margin-inline-start: calc(var(--finale-fan-width) / -2);
    overflow: hidden;

    border-radius: var(--border-radius-m);
    box-shadow:
      0 0 0 var(--border-thickness-xxs) var(--color-mixtape-stage-ring),
      var(--shadow-floating);
    transform: var(--fan-transform);
    transform-origin: 50% 100%;

    animation: finale-fan-in calc(4 * var(--transition-increment))
      cubic-bezier(0.34, 1.3, 0.5, 1) both;
    animation-delay: calc(var(--fan-index) * 70ms);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .finale-title {
    font-size: var(--ni-32);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .finale-stats {
    display: flex;
    justify-content: center;
    gap: var(--ni-28);
    margin-block-start: var(--gap-xs);
  }

  .finale-stat {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: var(--ni-2);

    dd {
      font-size: var(--ni-22);
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      line-height: 1.1;
    }
  }

  .finale-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--gap-xs);
    margin-block-start: var(--gap-xs);
  }

  .finale-links {
    display: flex;
    align-items: center;
    gap: var(--ni-4);
  }

  .finale-divider {
    width: var(--ni-3);
    height: var(--ni-3);
    border-radius: 50%;
    background: var(--color-text-secondary);
  }

  .finale-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .finale-round {
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

  .finale-rows {
    display: flex;
    flex-direction: column;
    padding: 0;
    list-style: none;
  }

  .finale-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding: var(--ni-10) var(--ni-12);
    margin-inline: calc(-1 * var(--ni-12));

    border-radius: var(--border-radius-m);

    animation: finale-row-in calc(3 * var(--transition-increment))
      cubic-bezier(0.2, 0.8, 0.2, 1) both;
    animation-delay: calc(220ms + var(--row-index) * 80ms);
    transition: background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
      }
    }
  }

  .finale-row-number {
    flex: none;
    width: var(--ni-24);

    color: var(--color-text-secondary);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-align: center;
  }

  .finale-row-link {
    flex: 1;
    display: flex;
    min-width: 0;

    :global(.trakt-link) {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      min-width: 0;
      text-decoration: none;
    }
  }

  .finale-row-poster {
    flex: none;
    width: var(--finale-poster-width);
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border-radius: var(--border-radius-s);
    box-shadow: 0 0 0 var(--border-thickness-xxs)
      var(--color-mixtape-stage-ring);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .finale-row-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .finale-new {
    flex: none;
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-pill);
    background: var(--purple-500);
    color: var(--purple-50);
    font-size: var(--font-size-tag);
    font-weight: 700;
  }

  .finale-row-match {
    flex: none;
    padding: var(--ni-4) var(--ni-10);

    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    font-size: var(--font-size-text-small);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  @container mixtape-finale (width >= 56rem) {
    .finale-layout {
      grid-template-columns: var(--ni-380) minmax(0, 1fr);
      column-gap: var(--ni-72);
      align-items: center;
    }
  }

  @include for-mobile {
    .trakt-mixtape-finale {
      --finale-fan-width: var(--ni-104);
      --finale-fan-step: var(--ni-60);
      --finale-poster-width: var(--ni-40);

      padding: var(--gap-s) var(--layout-distance-side) var(--gap-l);
    }

    .finale-layout {
      gap: var(--gap-m);
    }

    .finale-title {
      font-size: var(--ni-24);
    }

    .finale-actions {
      width: 100%;

      > :global(.trakt-button) {
        flex: 1;
      }
    }

    .finale-row {
      padding-inline: 0;
      margin-inline: 0;
    }
  }

  @keyframes finale-fan-in {
    from {
      opacity: 0;
      transform: translateY(var(--ni-16));
    }
  }

  @keyframes finale-row-in {
    from {
      opacity: 0;
      transform: translateX(calc(var(--rtl-sign, 1) * var(--ni-16)));
    }
  }
</style>
