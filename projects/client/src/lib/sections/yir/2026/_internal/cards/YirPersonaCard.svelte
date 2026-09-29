<script lang="ts">
  import type { YirPersonaId } from "$lib/requests/models/YirPersonaId";
  import type { Component } from "svelte";
  import AnimeVoyagerCard from "./AnimeVoyagerCard.svelte";
  import CinephileCard from "./CinephileCard.svelte";
  import ComfortRewatcherCard from "./ComfortRewatcherCard.svelte";
  import CriticCard from "./CriticCard.svelte";
  import CuratorCard from "./CuratorCard.svelte";
  import DayOneDevoteeCard from "./DayOneDevoteeCard.svelte";
  import LoyalistCard from "./LoyalistCard.svelte";
  import OmnivoreCard from "./OmnivoreCard.svelte";
  import OpeningActCard from "./OpeningActCard.svelte";
  import OpeningNightCard from "./OpeningNightCard.svelte";
  import type { PersonaCardProps } from "./PersonaCardProps";
  import WeekendMarathonerCard from "./WeekendMarathonerCard.svelte";
  import WildcardCard from "./WildcardCard.svelte";

  const CARDS: Record<YirPersonaId, Component<PersonaCardProps>> = {
    "anime-voyager": AnimeVoyagerCard,
    "day-one-devotee": DayOneDevoteeCard,
    "weekend-marathoner": WeekendMarathonerCard,
    "comfort-rewatcher": ComfortRewatcherCard,
    omnivore: OmnivoreCard,
    "opening-night": OpeningNightCard,
    cinephile: CinephileCard,
    critic: CriticCard,
    loyalist: LoyalistCard,
    curator: CuratorCard,
    wildcard: WildcardCard,
    "opening-act": OpeningActCard,
  };

  const { card, live = true }: Partial<PersonaCardProps> &
    Pick<PersonaCardProps, "card"> = $props();

  const Card = $derived(CARDS[card.persona]);

  let tilt = $state({ x: 0, y: 0, glareX: 50, glareY: 30 });

  const onpointermove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    tilt = { x: (x - 0.5) * 14, y: (0.5 - y) * 14, glareX: x * 100, glareY: y * 100 };
  };

  const onpointerleave = () => {
    tilt = { x: 0, y: 0, glareX: 50, glareY: 30 };
  };
</script>

<div
  class="trakt-yir-persona-card"
  role="img"
  aria-label={`${card.name}. ${card.tagline}`}
  {onpointermove}
  {onpointerleave}
>
  <div
    class="yir-persona-card-frame"
    style:--tilt-x="{tilt.y}deg"
    style:--tilt-y="{tilt.x}deg"
    style:--glare-x="{tilt.glareX}%"
    style:--glare-y="{tilt.glareY}%"
  >
    {#key card.persona}
      <Card {card} {live} />
    {/key}
    <div class="yir-persona-card-glare" aria-hidden="true"></div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-persona-card {
    perspective: 1000px;
    width: 100%;
  }

  .yir-persona-card-frame {
    container-type: inline-size;
    position: relative;
    width: 100%;
    aspect-ratio: 5 / 7;
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    box-shadow: 0 var(--ni-24) var(--ni-48) calc(-1 * var(--ni-22))
      color-mix(in srgb, var(--color-shadow) 55%, transparent);
    transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
    transition: transform var(--transition-increment) ease-out;
  }

  .yir-persona-card-glare {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    mix-blend-mode: soft-light;
    background: radial-gradient(
      60% 45% at var(--glare-x) var(--glare-y),
      white,
      transparent 70%
    );
    transition: opacity var(--transition-increment);
  }

  @include for-mouse {
    .trakt-yir-persona-card:hover .yir-persona-card-glare {
      opacity: 0.55;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-persona-card-frame {
      transform: none;
    }
  }
</style>
