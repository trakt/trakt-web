<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import { releaseCountdown } from "../shared/releaseCountdown.ts";
  import { seededRandom } from "../shared/seededRandom.ts";
  import { useStinger } from "../shared/useStinger.svelte.ts";
  import SigilRing from "./SigilRing.svelte";
  import WormMouth from "./WormMouth.svelte";

  const RUN = 1200;
  const CALM_HOLD = 1400;
  const SAFETY = 4000;
  const EXIT = 340;

  const { calendarDays: days, released } = releaseCountdown(Date.now());
  const tail = released
    ? m.text_topic_dunesday_stinger_now_showing()
    : days === 1
      ? m.text_topic_dunesday_stinger_days_one({ count: days })
      : m.text_topic_dunesday_stinger_days_other({ count: days });

  const stinger = useStinger({
    seenKey: "dunesday-stinger",
    holdFor: SAFETY,
    calmHoldFor: CALM_HOLD,
    exitFor: EXIT,
  });

  const random = seededRandom(1812);
  const debris = Array.from({ length: 28 }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const reach = 16 + random() * 34;
    return {
      index,
      world: index % 2 === 0 ? "dune" : "doom",
      dx: `${(Math.cos(angle) * reach).toFixed(1)}vmin`,
      dy: `${(Math.sin(angle) * reach).toFixed(1)}vmin`,
      size: `${(2 + random() * 5).toFixed(1)}px`,
    };
  });
</script>

{#snippet scene(id: string)}
  <div class="dd-stinger-sky"></div>
  <div class="dd-stinger-actor" data-actor="worm"><WormMouth {id} /></div>
  <div class="dd-stinger-actor" data-actor="sigil"><SigilRing /></div>
  <div class="dd-stinger-flash"></div>
  <div class="dd-stinger-wave"></div>
  <div class="dd-stinger-debris">
    {#each debris as bit (bit.index)}
      <i
        data-world={bit.world}
        style:--dx={bit.dx}
        style:--dy={bit.dy}
        style:--size={bit.size}
      ></i>
    {/each}
  </div>
  <div class="dd-stinger-copy">
    <p class="dd-stinger-title" onanimationend={stinger.leave}>
      <span>{m.text_topic_dunesday_title_start()}</span><span>
        {m.text_topic_dunesday_title_end()}
      </span>
    </p>
    <p class="dd-stinger-line">
      <span>{m.text_topic_dunesday_stinger_date()}</span><i></i><span>
        {tail}
      </span>
    </p>
  </div>
{/snippet}

{#if stinger.phase !== "idle"}
  <div
    class="dd-stinger"
    class:is-leaving={stinger.phase === "leaving"}
    class:is-calm={stinger.calm}
    style:--dd-exit={`${EXIT}ms`}
    style:--dd-run={`${RUN}ms`}
    role="presentation"
    aria-hidden="true"
  >
    <div class="dd-stinger-half" data-half="dune">{@render scene("ddw-a")}</div>
    <div class="dd-stinger-half" data-half="doom">{@render scene("ddw-b")}</div>
    <div class="dd-stinger-seam"></div>
  </div>
{/if}
