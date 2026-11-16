<svelte:options css="injected" />

<script lang="ts">
  import TraktLogoText from "$lib/features/share/assets/TraktLogoText.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    SHARE_TYPE_DIMENSIONS,
    type ShareType,
  } from "$lib/features/share/models/ShareType.ts";
  import { personaCardComponent } from "./_internal/cards/personaCardComponent.ts";
  import { personaPalette } from "./_internal/persona/personaPalette.ts";
  import type { YirShareData } from "./models/YirShareData.ts";
  import { yirShareCardWidth } from "./yirShareCardWidth.ts";

  const { data, variant }: { data: YirShareData; variant: ShareType } =
    $props();

  const toTranslucent = (color: string, alpha: number) =>
    color.replace(/\)$/, ` / ${alpha})`);

  const palette = $derived(personaPalette(data.card.persona));
  const Card = $derived(personaCardComponent(data.card.persona));
  const { width, height } = $derived(SHARE_TYPE_DIMENSIONS[variant]);
  const cardWidth = $derived(yirShareCardWidth(variant));
  const initial = $derived(
    data.user.name.replace(/^@/, "").at(0)?.toUpperCase() ?? "",
  );

  const theme = $derived(
    [
      `--yir-share-width: ${width}px`,
      `--yir-share-height: ${height}px`,
      `--yir-share-card-width: ${cardWidth}px`,
      `--yir-share-card-height: ${(cardWidth * 7) / 5}px`,
      `--yir-share-body: ${palette.body}`,
      `--yir-share-accent: ${palette.accent}`,
      `--yir-share-ink: ${palette.ink}`,
      `--yir-share-background: ${palette.background}`,
      `--yir-share-display: ${palette.display}`,
      `--yir-share-glow: ${toTranslucent(palette.accent, 0.38)}`,
      `--yir-share-muted: ${toTranslucent(palette.ink, 0.1)}`,
      `--yir-share-soft: ${toTranslucent(palette.accent, 0.16)}`,
    ].join("; "),
  );
</script>

{#snippet who()}
  <div class="yir-share-who">
    <div class="yir-share-avatar">
      {#if data.user.avatarUrl}
        <img src={data.user.avatarUrl} alt="" />
      {:else}
        <span>{initial}</span>
      {/if}
    </div>
    <div class="yir-share-identity">
      <div class="yir-share-name">{data.user.name}</div>
      <div class="yir-share-mono">YEAR IN REVIEW · {data.year}</div>
    </div>
  </div>
{/snippet}

{#snippet rarity()}
  <div class="yir-share-rarity">
    Only <b>{data.rarity}%</b> are {data.card.name}
  </div>
{/snippet}

{#snippet hybrid()}
  {#if data.runnerUp}
    <div class="yir-share-hybrid">
      <i style="--yir-share-runner-up: {data.runnerUp.accent}"></i>
      <span>{m.yir_2026_hybrid({ persona: data.runnerUp.name })}</span>
    </div>
  {/if}
{/snippet}

{#snippet logo()}
  <div class="yir-share-logo">
    <TraktLogoText />
  </div>
{/snippet}

{#snippet card()}
  <div class="yir-share-persona">
    <Card card={data.card} live={false} />
  </div>
{/snippet}

<div class="trakt-yir-share-card" data-variant={variant} style={theme}>
  <div class="yir-share-glow"></div>
  <div class="yir-share-year">{data.year}</div>

  {#if variant === "open-graph"}
    <div class="yir-share-copy">
      {@render who()}
      <div class="yir-share-headline">
        <div class="yir-share-kicker">My {data.year} persona</div>
        <div class="yir-share-title">{data.card.name}</div>
        <div class="yir-share-tagline">{data.card.tagline}</div>
      </div>
      <div class="yir-share-row">
        {@render rarity()}
        {@render hybrid()}
      </div>
      {@render logo()}
    </div>
    <div class="yir-share-stage">{@render card()}</div>
  {:else if variant === "feed"}
    <div class="yir-share-top">
      {@render who()}
      {@render logo()}
    </div>
    <div class="yir-share-stage">{@render card()}</div>
    <div class="yir-share-bottom">
      {@render rarity()}
      {@render hybrid()}
    </div>
  {:else}
    <div class="yir-share-top">{@render who()}</div>
    <div class="yir-share-stage">{@render card()}</div>
    <div class="yir-share-bottom">
      {@render rarity()}
      {@render hybrid()}
      <div class="yir-share-chips">
        {#each data.traits as trait (trait)}
          <span class="yir-share-chip">{trait}</span>
        {/each}
        <span class="yir-share-chip">{data.streak}-day streak</span>
      </div>
      {@render logo()}
    </div>
  {/if}
</div>

<style>
  .trakt-yir-share-card {
    position: relative;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    width: var(--yir-share-width);
    height: var(--yir-share-height);
    background: var(--yir-share-background);
    color: var(--yir-share-ink);
    font-family: var(--yir-share-body);
  }

  .yir-share-glow {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      closest-side,
      var(--yir-share-glow),
      transparent
    );
  }

  .yir-share-year {
    position: absolute;
    font-family: var(--yir-share-display);
    line-height: 0.8;
    color: var(--yir-share-accent);
    opacity: 0.09;
    white-space: nowrap;
    letter-spacing: -0.02em;
  }

  .yir-share-who {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .yir-share-avatar {
    display: flex;
    flex-shrink: 0;
    padding: 4px;
    border-radius: 50%;
    background: var(--yir-share-accent);
  }

  .yir-share-avatar img,
  .yir-share-avatar span {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 4px solid var(--yir-share-background);
    border-radius: 50%;
    object-fit: cover;
    background: var(--yir-share-accent);
    color: var(--yir-share-background);
    font-family: "JetBrains Mono", monospace;
    font-weight: 600;
  }

  .yir-share-identity {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .yir-share-name {
    font-weight: 700;
    line-height: 1.1;
  }

  .yir-share-mono {
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.18em;
    color: var(--yir-share-accent);
  }

  .yir-share-kicker {
    font-family: "JetBrains Mono", monospace;
    font-size: 22px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .yir-share-title {
    margin-top: 10px;
    font-family: var(--yir-share-display);
    font-size: 84px;
    line-height: 0.95;
  }

  .yir-share-tagline {
    margin-top: 16px;
    font-size: 28px;
    line-height: 1.3;
    opacity: 0.82;
  }

  .yir-share-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .yir-share-rarity {
    line-height: 1.2;
  }

  .yir-share-rarity b {
    margin: 0 0.25em;
    font-family: var(--yir-share-display);
    font-weight: 400;
    color: var(--yir-share-accent);
  }

  .yir-share-hybrid {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 2px solid var(--yir-share-accent);
    border-radius: 999px;
    background: var(--yir-share-soft);
    white-space: nowrap;
  }

  .yir-share-hybrid i {
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--yir-share-runner-up);
  }

  .yir-share-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
  }

  .yir-share-chip {
    padding: 8px 18px;
    border-radius: 999px;
    background: var(--yir-share-muted);
    font-family: "JetBrains Mono", monospace;
    font-size: 22px;
    letter-spacing: 0.06em;
  }

  .yir-share-logo {
    display: flex;
    flex-shrink: 0;
    color: var(--yir-share-ink);
  }

  .yir-share-logo :global(svg) {
    width: 100%;
    height: 100%;
  }

  .yir-share-stage {
    position: absolute;
    display: flex;
  }

  .yir-share-persona {
    position: relative;
    width: var(--yir-share-card-width);
    height: var(--yir-share-card-height);
    font-family: var(--yir-share-body);
    overflow: hidden;
    border-radius: 28px;
    box-shadow: 0 56px 110px -36px rgb(0 0 0 / 0.75);
  }

  .yir-share-top,
  .yir-share-bottom {
    position: absolute;
    display: flex;
    align-items: center;
  }

  [data-variant="open-graph"] .yir-share-glow {
    left: 370px;
    top: -135px;
    width: 900px;
    height: 900px;
  }

  [data-variant="open-graph"] .yir-share-year {
    right: -30px;
    bottom: -110px;
    font-size: 340px;
  }

  [data-variant="open-graph"] .yir-share-copy {
    position: absolute;
    left: 64px;
    top: 56px;
    bottom: 56px;
    width: 640px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  [data-variant="open-graph"] .yir-share-avatar img,
  [data-variant="open-graph"] .yir-share-avatar span {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }

  [data-variant="open-graph"] .yir-share-name {
    font-size: 28px;
  }

  [data-variant="open-graph"] .yir-share-mono {
    font-size: 16px;
  }

  [data-variant="open-graph"] .yir-share-rarity {
    font-size: 24px;
  }

  [data-variant="open-graph"] .yir-share-hybrid,
  [data-variant="feed"] .yir-share-hybrid {
    padding: 6px 16px 6px 8px;
    font-size: 20px;
  }

  [data-variant="open-graph"] .yir-share-hybrid i,
  [data-variant="feed"] .yir-share-hybrid i {
    width: 20px;
    height: 20px;
  }

  [data-variant="open-graph"] .yir-share-logo {
    width: 150px;
    height: 36px;
  }

  [data-variant="open-graph"] .yir-share-stage {
    right: 96px;
    top: 56px;
    transform: rotate(4deg);
  }

  [data-variant="open-graph"] .yir-share-persona {
    box-shadow: 0 40px 80px -30px rgb(0 0 0 / 0.7);
  }

  [data-variant="feed"] .yir-share-glow {
    left: -10px;
    top: -30px;
    width: 1100px;
    height: 1100px;
  }

  [data-variant="feed"] .yir-share-year {
    left: -40px;
    bottom: -150px;
    font-size: 420px;
  }

  [data-variant="feed"] .yir-share-top {
    left: 56px;
    right: 56px;
    top: 52px;
    justify-content: space-between;
  }

  [data-variant="feed"] .yir-share-avatar img,
  [data-variant="feed"] .yir-share-avatar span {
    width: 72px;
    height: 72px;
    font-size: 28px;
  }

  [data-variant="feed"] .yir-share-name {
    font-size: 32px;
  }

  [data-variant="feed"] .yir-share-mono {
    font-size: 18px;
  }

  [data-variant="feed"] .yir-share-logo {
    width: 167px;
    height: 40px;
  }

  [data-variant="feed"] .yir-share-stage {
    left: 300px;
    top: 170px;
  }

  [data-variant="feed"] .yir-share-bottom {
    left: 56px;
    right: 56px;
    bottom: 52px;
    justify-content: space-between;
    gap: 16px;
  }

  [data-variant="feed"] .yir-share-rarity {
    font-size: 30px;
  }

  [data-variant="story"] .yir-share-glow {
    left: -210px;
    top: 150px;
    width: 1500px;
    height: 1500px;
  }

  [data-variant="story"] .yir-share-year {
    left: 0;
    right: 0;
    bottom: 20px;
    text-align: center;
    font-size: 520px;
  }

  [data-variant="story"] .yir-share-top {
    left: 0;
    right: 0;
    top: 150px;
    justify-content: center;
  }

  [data-variant="story"] .yir-share-avatar img,
  [data-variant="story"] .yir-share-avatar span {
    width: 88px;
    height: 88px;
    font-size: 34px;
  }

  [data-variant="story"] .yir-share-name {
    font-size: 44px;
  }

  [data-variant="story"] .yir-share-mono {
    font-size: 22px;
  }

  [data-variant="story"] .yir-share-stage {
    left: 110px;
    top: 280px;
  }

  [data-variant="story"] .yir-share-bottom {
    left: 80px;
    right: 80px;
    top: 1520px;
    flex-direction: column;
    gap: 18px;
    text-align: center;
  }

  [data-variant="story"] .yir-share-rarity {
    font-size: 42px;
  }

  [data-variant="story"] .yir-share-hybrid {
    padding: 10px 26px 10px 12px;
    font-size: 30px;
  }

  [data-variant="story"] .yir-share-hybrid i {
    width: 30px;
    height: 30px;
  }

  [data-variant="story"] .yir-share-logo {
    width: 184px;
    height: 44px;
    margin-top: 6px;
  }
</style>
