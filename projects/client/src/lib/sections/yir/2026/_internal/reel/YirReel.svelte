<script lang="ts">
  import type { Snippet } from "svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import type { YirPersonaResult } from "$lib/requests/models/YirPersonaResult";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber";
  import { clamp } from "$lib/utils/number/clamp";
  import { onMount } from "svelte";
  import { collectYirImageUrls } from "./collectYirImageUrls";
  import { flipRotation } from "./flipRotation";
  import { monthIndexFor } from "./monthIndexFor";
  import { sceneProgress } from "./sceneProgress";
  import { warmImages } from "./warmImages";
  import { reelPosters } from "./reelPosters";
  import { reelTopTitle } from "./reelTopTitle";
  import { toPersonaCardData } from "../cards/toPersonaCardData";
  import { traitLabel } from "../persona/traitLabel";
  import YirHybridStamp from "../cards/YirHybridStamp.svelte";
  import YirReelCta from "./YirReelCta.svelte";
  import YirReelFlipCard from "./YirReelFlipCard.svelte";
  import YirReelMonths from "./YirReelMonths.svelte";
  import YirReelPosters from "./YirReelPosters.svelte";
  import YirReelRing from "./YirReelRing.svelte";

  const {
    result,
    detail,
    name,
    year,
    onclose,
    overlay,
  }: {
    result: YirPersonaResult;
    detail: YirDetail | null;
    name: string;
    year: number;
    onclose: () => void;
    overlay?: Snippet;
  } = $props();

  const primary = $derived(
    toPersonaCardData({
      result,
      persona: result.persona,
      highlights: result.highlights,
    }),
  );
  const runner = $derived(
    result.runnerUp
      ? toPersonaCardData({
          result,
          persona: result.runnerUp,
          highlights: result.runnerUpHighlights,
        })
      : null,
  );

  const locale = getLocale();

  const hours = $derived(
    Math.round((detail?.stats.all.minutes.total ?? 0) / 60),
  );
  const top = $derived(reelTopTitle(detail));
  const posters = $derived(reelPosters(detail));
  const hasMonthly = $derived(result.persona !== "opening-act");

  const scenes = $derived([
    "title",
    "hours",
    "top",
    "streak",
    ...(hasMonthly ? ["monthly"] : []),
    "card",
  ]);

  let dialog = $state<HTMLDialogElement>();
  let scroller = $state<HTMLElement>();
  let sceneElements = $state<HTMLElement[]>([]);
  let progress = $state<Record<string, number>>({});
  let total = $state(0);
  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  const reduced = $derived($isReducedMotion);

  const at = (scene: string) => (reduced ? 1 : (progress[scene] ?? 0));
  const reach = (scene: string) => Math.min(1, at(scene) * 1.4);

  const monthIndex = $derived(
    monthIndexFor(at("monthly"), result.monthly.length),
  );

  const flip = $derived.by(() => {
    const cardProgress = at("card");
    const desktop = Math.min(1, (reduced ? 1 : total) / 0.9);

    return { mobile: cardProgress, desktop };
  });

  let live = $state({
    mobile: { front: false, back: false },
    desktop: { front: false, back: false },
  });

  const latchLive = () => {
    const backAt = runner ? 0.6 : 0.2;
    const next = {
      mobile: {
        front: live.mobile.front || flip.mobile > 0.2,
        back: live.mobile.back || flip.mobile > backAt,
      },
      desktop: {
        front: true,
        back: live.desktop.back || !runner || flip.desktop > 0.6,
      },
    };

    if (
      next.mobile.front !== live.mobile.front ||
      next.mobile.back !== live.mobile.back ||
      next.desktop.front !== live.desktop.front ||
      next.desktop.back !== live.desktop.back
    ) {
      live = next;
    }
  };

  const chapters: Record<string, () => string> = {
    title: () => String(year),
    hours: m.yir_2026_reel_hours,
    top: m.yir_2026_reel_number_one,
    streak: m.yir_2026_reel_streak,
    monthly: m.yir_2026_reel_month_by_month,
  };

  const isCtaVisible = $derived(reduced || at("card") > 0.55);

  const kicker = (isRunnerFace: boolean) => {
    if (!runner) return m.yir_2026_reel_and_you_are();
    return isRunnerFace
      ? m.yir_2026_reel_a_little_bit({ persona: runner.name })
      : m.yir_2026_reel_but_mostly();
  };

  const mobileRotation = $derived(flipRotation(flip.mobile, !!runner));
  const desktopRotation = $derived(flipRotation(flip.desktop, !!runner));
  const isMobileRunnerFace = $derived(flip.mobile < 0.6);
  const isDesktopRunnerFace = $derived(flip.desktop < 0.6);
  const mobileKicker = $derived(kicker(isMobileRunnerFace));
  const desktopKicker = $derived(kicker(isDesktopRunnerFace));

  let frame = 0;
  const EASING = 0.14;
  const SETTLED = 0.001;

  let target: Record<string, number> = {};
  let targetTotal = 0;

  type Geometry = {
    viewport: number;
    scrollable: number;
    scenes: ReadonlyArray<{ top: number; height: number }>;
  };

  let geometry: Geometry = { viewport: 0, scrollable: 1, scenes: [] };

  const readGeometry = () => {
    if (!scroller) return;

    geometry = {
      viewport: scroller.clientHeight,
      scrollable: Math.max(1, scroller.scrollHeight - scroller.clientHeight),
      scenes: sceneElements.map((element) => ({
        top: element.offsetTop,
        height: element.offsetHeight,
      })),
    };
  };

  const readTargets = () => {
    if (!scroller) return;

    const top = scroller.scrollTop;

    targetTotal = clamp({ value: top / geometry.scrollable, min: 0, max: 1 });
    target = Object.fromEntries(
      geometry.scenes.map((scene, index) => {
        const id = scenes.at(index) ?? "";
        return [
          id,
          sceneProgress({
            scrollTop: top,
            sceneTop: scene.top,
            sceneHeight: scene.height,
            viewportHeight: geometry.viewport,
            isPinnedOnly: id === "monthly",
          }),
        ];
      }),
    );
  };

  const measure = () => {
    frame = 0;
    readTargets();

    let moving = false;
    const step = (current: number, next: number) => {
      const delta = next - current;
      if (Math.abs(delta) < SETTLED) return next;
      moving = true;
      return current + delta * EASING;
    };

    const nextTotal = step(total, targetTotal);
    if (nextTotal !== total) total = nextTotal;

    for (const [scene, value] of Object.entries(target)) {
      const current = progress[scene] ?? 0;
      const next = step(current, value);
      if (next !== current) progress[scene] = next;
    }
    latchLive();

    if (moving) frame = requestAnimationFrame(measure);
  };

  const onscroll = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  const jumpTo = (scene: string) => {
    const element = sceneElements.at(scenes.indexOf(scene));
    scroller?.scrollTo({
      top: element?.offsetTop ?? 0,
      behavior: reduced ? "auto" : "smooth",
    });
  };


  onMount(() => {
    readGeometry();
    measure();

    const resize = new ResizeObserver(() => {
      readGeometry();
      onscroll();
    });
    if (scroller) resize.observe(scroller);
    sceneElements.forEach((element) => element && resize.observe(element));
    if (typeof dialog?.showModal === "function") dialog.showModal();
    else dialog?.setAttribute("open", "");
    scroller?.focus();

    const stopWarming = warmImages(collectYirImageUrls(detail));

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      stopWarming();
    };
  });
</script>

<dialog
  bind:this={dialog}
  class="trakt-yir-reel"
  aria-label={m.yir_2026_replay()}
  oncancel={(event) => {
    event.preventDefault();
    onclose();
  }}
>
  <div class="yir-reel-progress" aria-hidden="true">
    <b style:--total={total}></b>
  </div>
  <button class="yir-reel-skip" type="button" onclick={onclose}>
    {m.yir_2026_reel_skip()}
  </button>

  <YirReelCta
    isVisible={isCtaVisible}
    isReducedMotion={reduced}
    {onclose}
  />

  <div
    class="yir-reel-scroller"
    bind:this={scroller}
    {onscroll}
    tabindex="-1"
  >
    <div class="yir-reel-stage">
      <div class="yir-reel-scenes">
        <section
          class="yir-reel-scene"
          bind:this={sceneElements[0]}
          style:--p={at("title")}
        >
          <div class="yir-reel-sticky is-title">
            <span class="yir-reel-kicker">{m.yir_2026_reel_presents()}</span>
            <span class="yir-reel-year">{year}</span>
            <span class="yir-reel-sub">
              {m.yir_2026_reel_your_year({ name })}
            </span>
            <span class="yir-reel-cue" aria-hidden="true">
              {m.yir_2026_reel_scroll()} ↓
            </span>
          </div>
        </section>

        <section
          class="yir-reel-scene"
          bind:this={sceneElements[1]}
          style:--p={at("hours")}
        >
          <div class="yir-reel-sticky">
            <span class="yir-reel-kicker">{m.yir_2026_reel_you_watched()}</span>
            <span class="yir-reel-huge">
              {toGroupedNumber(Math.round(hours * reach("hours")), locale)}
            </span>
            <span class="yir-reel-sub">{m.yir_2026_reel_hours()}</span>
            <span class="yir-reel-sub is-reveal">
              {m.yir_2026_reel_days_of_screen({
                days: (hours / 24).toFixed(1),
              })}
            </span>
          </div>
        </section>

        <section
          class="yir-reel-scene"
          bind:this={sceneElements[2]}
          style:--p={at("top")}
        >
          <div class="yir-reel-sticky">
            <span class="yir-reel-kicker">{m.yir_2026_reel_number_one()}</span>
            <YirReelPosters {posters} />
            {#if top}
              <span class="yir-reel-big">{top.entry.title}</span>
              <span class="yir-reel-sub">
                {m.yir_2026_reel_plays({
                  count: toGroupedNumber(top.plays, locale),
                })}
              </span>
            {/if}
          </div>
        </section>

        <section
          class="yir-reel-scene"
          bind:this={sceneElements[3]}
          style:--p={at("streak")}
        >
          <div class="yir-reel-sticky">
            <span class="yir-reel-kicker">{m.yir_2026_reel_streak()}</span>
            <YirReelRing
              days={result.streak.longest}
              reach={reach("streak")}
            />
            <span class="yir-reel-sub">{m.yir_2026_reel_days_in_row()}</span>
          </div>
        </section>

        {#if hasMonthly}
          <section
            class="yir-reel-scene is-monthly"
            bind:this={sceneElements[4]}
            style:--p={at("monthly")}
            style:--months={result.monthly.length}
          >
            <div class="yir-reel-sticky">
              <span class="yir-reel-kicker">
                {m.yir_2026_reel_month_by_month()}
              </span>
              <YirReelMonths
                monthly={result.monthly}
                {monthIndex}
                {year}
                fallback={result.persona}
                isReducedMotion={reduced}
              />
              <span class="yir-reel-sub">
                {m.yir_2026_reel_mostly({ persona: primary.name })}
              </span>
            </div>
          </section>
        {/if}

        <section
          class="yir-reel-scene is-finale"
          bind:this={sceneElements[scenes.length - 1]}
          style:--p={at("card")}
        >
          <div class="yir-reel-sticky">
            <span class="yir-reel-kicker is-mobile">{mobileKicker}</span>
            <div
              class="yir-reel-card is-mobile"
              style:--rotation="{mobileRotation}deg"
              style:--appear={Math.min(1, flip.mobile * 3)}
            >
              <YirReelFlipCard
                {primary}
                {runner}
                faces={live.mobile}
                isFlipped={mobileRotation >= 90}
              />
            </div>

            <span class="yir-reel-kicker is-desktop">
              {m.yir_2026_reel_and_you_are()}
            </span>
            <span class="yir-reel-big is-desktop">{primary.name}</span>
            <span class="yir-reel-sub is-desktop">{primary.tagline}</span>

            {#if runner && flip.mobile > 0.8}
              <YirHybridStamp name={runner.name} />
            {/if}
            <span class="yir-reel-sub">
              {m.yir_2026_rarity({
                percent: result.rarity,
                persona: primary.name,
              })}
            </span>
            <ul class="yir-reel-traits">
              {#each result.traits as trait (trait)}
                <li>{traitLabel(trait)}</li>
              {/each}
            </ul>

            <span class="yir-reel-finale-spacer" aria-hidden="true"></span>
            <nav class="yir-reel-chapters" aria-label={m.yir_2026_reel_jump_back()}>
              <span>{m.yir_2026_reel_jump_back()}</span>
              {#each scenes.slice(0, -1) as scene (scene)}
                <button type="button" onclick={() => jumpTo(scene)}>
                  {chapters[scene]?.()}
                </button>
              {/each}
            </nav>
          </div>
        </section>
      </div>

      <aside class="yir-reel-side" aria-hidden="true">
        <div class="yir-reel-side-sticky">
          <span class="yir-reel-kicker">{desktopKicker}</span>
          <div
            class="yir-reel-card"
            style:--rotation="{desktopRotation}deg"
            style:--appear={1}
          >
            <YirReelFlipCard
              {primary}
              {runner}
              faces={live.desktop}
              isFlipped={desktopRotation >= 90}
            />
          </div>
        </div>
      </aside>
    </div>
  </div>
  {@render overlay?.()}
</dialog>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin split-stage {
    @include for-tablet-lg {
      @content;
    }

    @include for-desktop {
      @content;
    }
  }

  .trakt-yir-reel {
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    z-index: var(--layer-overlay);

    &::backdrop {
      background: var(--color-yir-background);
    }
    background: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    font-family: var(--yir-font-body);
  }

  .yir-reel-progress {
    position: absolute;
    inset-inline: 0;
    top: env(safe-area-inset-top, 0);
    height: var(--ni-4);
    z-index: var(--layer-raised);
    background: var(--color-yir-separator);

    b {
      display: block;
      height: 100%;
      background: var(--color-yir-accent);
      transform-origin: left;
      transform: scaleX(var(--total));

      :global([dir="rtl"]) & {
        transform-origin: right;
      }
    }
  }

  .yir-reel-skip {
    position: absolute;
    top: calc(env(safe-area-inset-top, 0) + var(--ni-16));
    inset-inline-end: var(--ni-16);
    z-index: var(--layer-raised);
    padding: var(--ni-8) var(--ni-16);
    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid var(--color-yir-border-subtle);
    background: var(--color-yir-scrim);
    color: var(--color-yir-text-primary);
    font: inherit;
    font-size: var(--font-size-tag);
    cursor: pointer;
  }

  .yir-reel-scroller {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    outline: none;
  }

  .yir-reel-stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    max-width: var(--ni-1280);
    margin-inline: auto;

    @include split-stage {
      grid-template-columns: minmax(0, 1fr) minmax(0, 36%);
      gap: var(--ni-48);
      padding-inline: var(--ni-48);
    }
  }

  .yir-reel-scene {
    container-type: inline-size;
    height: 180dvh;

    &.is-finale {
      height: 240dvh;
    }

    &.is-monthly {
      height: calc(100dvh + var(--months) * 45dvh);
    }

    @include split-stage {
      height: 170dvh;

      &.is-finale {
        height: 110dvh;
      }

      &.is-monthly {
        height: calc(100dvh + var(--months) * 40dvh);
      }
    }
  }

  .yir-reel-sticky {
    position: sticky;
    top: 0;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: var(--ni-12);
    padding: var(--ni-72) var(--ni-24) var(--ni-32);
    overflow: hidden;
    opacity: clamp(0.15, 0.15 + var(--p) * 2, 1);

    &.is-title,
    .is-monthly > & {
      opacity: 1;
    }
    transform: translateY(calc((1 - min(1, var(--p) * 2)) * var(--ni-32)));

    @include split-stage {
      align-items: flex-start;
      text-align: start;
    }

    @media (max-height: 30rem) {
      padding-block: var(--ni-48) var(--ni-16);
      gap: var(--ni-6);
    }
  }

  .yir-reel-kicker {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-yir-text-muted);
  }

  .yir-reel-year {
    font-family: var(--yir-font-display);
    font-size: min(24cqi, 42dvh);
    line-height: 0.85;
    color: var(--color-yir-accent);
    transform: scale(calc(1.15 - 0.15 * var(--p)));
    transform-origin: center;

    @include split-stage {
      transform-origin: left center;

      :global([dir="rtl"]) & {
        transform-origin: right center;
      }
    }
  }

  .yir-reel-huge {
    font-family: var(--yir-font-display);
    font-size: min(22cqi, 30dvh);
    line-height: 0.9;
    color: var(--color-yir-accent);
    font-variant-numeric: tabular-nums;
  }

  .yir-reel-big {
    font-family: var(--yir-font-display);
    font-size: min(9cqi, 12dvh, var(--ni-80));
    line-height: 1;
    max-width: 18ch;
  }

  .yir-reel-sub {
    font-size: var(--font-size-title);
    color: var(--color-yir-text-secondary);
    max-width: 32ch;

    &.is-reveal {
      opacity: calc((var(--p) - 0.5) * 3);
      transform: translateY(calc((1 - var(--p)) * var(--ni-24)));
    }
  }

  .yir-reel-cue {
    margin-top: var(--ni-24);
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: calc(1 - var(--p) * 2);
  }

  .yir-reel-card {
    width: min(78vw, calc(62dvh * 5 / 7));
    perspective: 1200px;
    opacity: var(--appear);
    transform: translateY(calc((1 - var(--appear)) * var(--ni-48)))
      scale(calc(0.85 + 0.15 * var(--appear)));
  }

  .yir-reel-traits {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-6);
    margin: 0;
    padding: 0;
    list-style: none;
    justify-content: center;

    @include split-stage {
      justify-content: flex-start;
    }

    li {
      padding: var(--ni-4) var(--ni-12);
      border-radius: var(--border-radius-xxl);
      border: var(--ni-1) solid var(--color-yir-border-subtle);
      font-size: var(--font-size-tag);
    }
  }


  .is-finale .yir-reel-sticky {
    box-sizing: border-box;
    height: auto;
    min-height: 100dvh;
    padding-bottom: calc(var(--ni-120) + env(safe-area-inset-bottom, 0px));

    @include split-stage {
      box-sizing: content-box;
      height: 100dvh;
      min-height: 0;
      padding-bottom: var(--ni-32);
    }
  }

  .yir-reel-finale-spacer {
    display: block;
    flex: 1 0 var(--ni-24);

    @include split-stage {
      flex: initial;
      height: var(--ni-120);
    }
  }

  .yir-reel-chapters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--ni-6);
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-muted);

    @include split-stage {
      justify-content: flex-start;
    }

    button {
      padding: var(--ni-4) var(--ni-12);
      border-radius: var(--border-radius-xxl);
      border: var(--ni-1) solid var(--color-yir-border-subtle);
      background: none;
      color: var(--color-yir-text-secondary);
      font: inherit;
      cursor: pointer;
    }
  }

  .is-desktop,
  .yir-reel-side {
    display: none;
  }

  @include split-stage {
    .is-mobile {
      display: none;
    }

    .is-desktop {
      display: block;
    }

    .yir-reel-side {
      display: block;
    }

    .yir-reel-card {
      width: min(100%, calc(70dvh * 5 / 7));
    }
  }

  .yir-reel-side-sticky {
    animation: side-enter calc(var(--yir-beat) * 9) var(--yir-ease) calc(var(--yir-beat) * 2) both;
    position: sticky;
    top: 0;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--ni-16);
  }

  @keyframes side-enter {
    from {
      opacity: 0;
      transform: translateY(var(--ni-32));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-reel-side-sticky {
      animation: none;
    }

    .yir-reel-scene,
    .yir-reel-scene.is-finale,
    .yir-reel-scene.is-monthly {
      height: auto;
    }

    .yir-reel-sticky {
      position: static;
      height: auto;
      min-height: 100dvh;
    }
  }

  .yir-reel-card {
    view-transition-name: yir-persona-card;
  }
</style>
