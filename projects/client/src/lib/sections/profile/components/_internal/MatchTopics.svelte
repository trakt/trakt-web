<script lang="ts">
  import type { UserMatchSharedSubgenre } from "$lib/requests/models/UserMatch.ts";

  const { topics }: { topics: UserMatchSharedSubgenre[] } = $props();

  const [lead, ...rest] = $derived(topics);
  const runnersUp = $derived(rest.slice(0, 2));
  const supporting = $derived(rest.slice(2, 5));
</script>

<section class="trakt-match-topics">
  {#if lead}
    <p class="lead">
      <svg class="sparkle" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          pathLength="100"
          d="M12 2.5L14.3 9.7L21.5 12L14.3 14.3L12 21.5L9.7 14.3L2.5 12L9.7 9.7Z"
        />
      </svg>
      <span>{lead.name}</span>
    </p>
  {/if}

  {#if runnersUp.length > 0}
    <ul class="runners-up">
      {#each runnersUp as topic (topic.id)}
        <li>{topic.name}</li>
      {/each}
    </ul>
  {/if}

  {#if supporting.length > 0}
    <ul class="supporting">
      {#each supporting as topic (topic.id)}
        <li>{topic.name}</li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  .trakt-match-topics {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);

    text-align: center;
    text-wrap: balance;
  }

  .lead {
    display: flex;
    align-items: center;
    gap: var(--ni-8);

    min-height: var(--ni-38);
    color: var(--color-text-primary);

    span {
      font-size: var(--ni-32);
      line-height: var(--ni-38);
      font-weight: 700;
      letter-spacing: -0.01em;
    }
  }

  .sparkle {
    flex: none;
    width: var(--ni-24);
    height: var(--ni-24);

    path {
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linejoin: round;
      stroke-dasharray: 100 100;

      @media (prefers-reduced-motion: no-preference) {
        animation: match-sparkle-draw 300ms ease-out 700ms both;
      }
    }
  }

  .runners-up,
  .supporting {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: baseline;

    margin: 0;
    padding: 0;
    list-style: none;

    li + li::before {
      content: "\00b7";
      color: var(--color-text-secondary);
      font-weight: 400;
    }
  }

  .runners-up {
    min-height: var(--ni-28);
    color: var(--color-text-primary);

    li {
      font-size: var(--ni-22);
      line-height: var(--ni-28);
      font-weight: 600;
    }

    li + li::before {
      margin-inline: var(--ni-12);
    }
  }

  .supporting {
    min-height: var(--ni-22);
    color: var(--color-text-secondary);

    li {
      font-size: var(--ni-14);
      line-height: var(--ni-22);
    }

    li + li::before {
      margin-inline: var(--ni-10);
    }
  }

  @keyframes match-sparkle-draw {
    from {
      stroke-dashoffset: 100;
    }
  }
</style>
