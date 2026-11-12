<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  const { label }: { label: string } = $props();
</script>

{#snippet ticket(year: number)}
  <span class="ticket" data-year={year}>
    <span class="ticket-main">
      <span class="ticket-kicker">{m.text_ticket_brand()}</span>
      <span class="ticket-year"
        >{m.text_ticket_year({ number: `${year}` })}</span
      >
      <span class="ticket-admit">{m.text_ticket_admit_one()}</span>
    </span>
    <span class="ticket-stub"><span>{label}</span></span>
  </span>
{/snippet}

<span class="trakt-ticket-pair" aria-hidden="true">
  {@render ticket(1)}
  {@render ticket(2)}
</span>

<style lang="scss">
  .trakt-ticket-pair {
    --ticket-notch: 0.72em;

    position: relative;
    display: block;
    flex-shrink: 0;

    width: 15.4em;
    height: 9.4em;

    font-size: var(--ticket-pair-size, calc(var(--ni-10) * 0.8));
    pointer-events: none;
    filter: drop-shadow(
      0 0.7em 1.1em color-mix(in srgb, var(--shade-1000) 55%, transparent)
    );

    span {
      font-size: inherit;
    }

    .ticket {
      position: absolute;
      display: flex;

      width: 11.6em;
      height: 5.3em;

      border-radius: 0.45em;

      mask:
        radial-gradient(
            circle at 0 50%,
            transparent var(--ticket-notch),
            black calc(var(--ticket-notch) + 0.02em)
          )
          0 0 / 51% 100% no-repeat,
        radial-gradient(
            circle at 100% 50%,
            transparent var(--ticket-notch),
            black calc(var(--ticket-notch) + 0.02em)
          )
          100% 0 / 51% 100% no-repeat;
    }

    .ticket[data-year="1"] {
      top: 0;
      inset-inline-start: 0;

      background: var(--shade-10);
      color: var(--shade-920);
      transform: rotate(-8deg);
    }

    .ticket[data-year="2"] {
      top: 3.3em;
      inset-inline-start: 3.5em;

      background: linear-gradient(135deg, var(--purple-400), var(--purple-600));
      color: var(--shade-10);
      transform: rotate(5deg);

      .ticket-stub {
        border-inline-start-color: color-mix(
          in srgb,
          var(--shade-10) 45%,
          transparent
        );
      }
    }

    .ticket-main {
      flex: 1;
      min-width: 0;

      display: grid;
      align-content: center;
      gap: 0.16em;

      padding-inline-start: 1.35em;
    }

    .ticket-kicker,
    .ticket-admit {
      font-size: 0.56em;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .ticket-kicker {
      opacity: 0.62;
    }

    .ticket-year {
      font-size: 2em;
      font-weight: 900;
      line-height: 0.9;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .ticket-stub {
      display: grid;
      place-items: center;
      flex-shrink: 0;

      width: 2.7em;

      border-inline-start: 0.13em dashed
        color-mix(in srgb, var(--shade-500) 55%, transparent);

      span {
        writing-mode: vertical-rl;
        transform: rotate(180deg);

        font-size: 0.62em;
        font-weight: 800;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        white-space: nowrap;
      }
    }
  }
</style>
