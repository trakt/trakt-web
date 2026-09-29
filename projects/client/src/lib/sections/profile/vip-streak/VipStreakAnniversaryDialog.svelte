<script lang="ts" module>
  const PIECE_COUNT = 24;
  const PIECE_COLORS = [
    "var(--color-background-vip-badge-silver-start)",
    "var(--color-background-vip-badge-silver-end)",
    "var(--color-glow-vip-badge-vip)",
    "var(--color-background-vip-badge-deep-end)",
  ];

  function confetti() {
    return Array.from({ length: PIECE_COUNT }, (_, index) => ({
      inset: (index * 37) % 100,
      delay: (index * 53) % 600,
      drift: ((index * 29) % 7) - 3,
      spin: 180 + ((index * 71) % 360),
      color: PIECE_COLORS[index % PIECE_COLORS.length],
    }));
  }
</script>

<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Modal from "$lib/components/dialogs/Modal.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipVeteran } from "$lib/requests/models/VipVeteran.ts";
  import { toHumanMonthYear } from "$lib/utils/formatting/date/toHumanMonthYear.ts";

  const { veteran, onClose }: { veteran: VipVeteran; onClose: () => void } =
    $props();

  const pieces = confetti();

  const title = $derived(
    veteran.years === 1
      ? m.text_vip_anniversary_title_one()
      : m.text_vip_anniversary_title_other({ years: String(veteran.years) }),
  );
</script>

<Modal {onClose}>
  <div class="trakt-vip-streak-anniversary">
    <div class="anniversary-confetti" aria-hidden="true">
      {#each pieces as piece, index (index)}
        <span
          class="confetti-piece"
          style="--piece-inset: {piece.inset}%; --piece-delay: {piece.delay}ms; --piece-drift: {piece.drift}; --piece-spin: {piece.spin}deg; --piece-color: {piece.color};"
        ></span>
      {/each}
    </div>

    <span class="anniversary-years" aria-hidden="true">{veteran.years}</span>
    <h2>{title}</h2>
    <p class="secondary">
      {m.text_vip_anniversary_body({
        date: toHumanMonthYear(veteran.since, languageTag()),
      })}
    </p>
  </div>

  {#snippet footer()}
    <Button onclick={onClose} color="purple" label={m.button_label_close()}>
      {m.button_label_close()}
    </Button>
  {/snippet}
</Modal>

<style>
  .trakt-vip-streak-anniversary {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    padding-block: var(--gap-l) var(--gap-m);
    text-align: center;
  }

  .anniversary-years {
    font-size: var(--ni-64);
    font-weight: 800;
    line-height: 1;
    font-variant-numeric: tabular-nums;

    background: linear-gradient(
      135deg,
      var(--color-background-vip-badge-silver-start),
      var(--color-glow-vip-badge-vip)
    );
    background-clip: text;
    color: transparent;
  }

  .anniversary-confetti {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .confetti-piece {
    position: absolute;
    top: 0;
    inset-inline-start: var(--piece-inset);

    width: var(--ni-6);
    height: var(--ni-12);
    border-radius: var(--ni-2);
    background-color: var(--piece-color);

    animation: confetti-fall 1.8s cubic-bezier(0.25, 0.6, 0.4, 1)
      var(--piece-delay) both;
  }

  @keyframes confetti-fall {
    from {
      opacity: 0;
      transform: translate(0, calc(-1 * var(--ni-24))) rotate(0);
    }
    15% {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translate(
          calc(var(--piece-drift) * var(--ni-12)),
          var(--ni-240)
        )
        rotate(var(--piece-spin));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .anniversary-confetti {
      display: none;
    }
  }
</style>
