<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";

  type FaqItem = {
    question: () => string;
    answer: () => string;
  };

  const items: ReadonlyArray<FaqItem> = [
    {
      question: m.tv_time_faq_nothing_imported_question,
      answer: m.tv_time_faq_nothing_imported_answer,
    },
    {
      question: m.tv_time_faq_missing_episodes_question,
      answer: m.tv_time_faq_missing_episodes_answer,
    },
    {
      question: m.tv_time_faq_missing_ratings_question,
      answer: m.tv_time_faq_missing_ratings_answer,
    },
    {
      question: m.tv_time_faq_dropped_shows_question,
      answer: m.tv_time_faq_dropped_shows_answer,
    },
  ];

  let openIndex = $state<number | null>(null);

  const toggle = (index: number) => {
    openIndex = openIndex === index ? null : index;
  };
</script>

<ul class="trakt-tv-time-faq">
  {#each items as item, index (index)}
    {@const isOpen = openIndex === index}
    <li class="faq-item">
      <button
        type="button"
        class="faq-question"
        aria-expanded={isOpen}
        aria-controls={`tv-time-faq-answer-${index}`}
        onclick={() => toggle(index)}
      >
        <span class="bold">{item.question()}</span>
        <span class="faq-caret" class:is-open={isOpen}>
          <CaretRightIcon />
        </span>
      </button>

      {#if isOpen}
        <div
          id={`tv-time-faq-answer-${index}`}
          class="faq-answer"
          transition:slide={{ duration: 150, axis: "y" }}
        >
          <p class="secondary">{item.answer()}</p>
        </div>
      {/if}
    </li>
  {/each}
</ul>

<style lang="scss">
  .trakt-tv-time-faq {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin: 0;
    padding: 0;
    list-style: none;
  }

  .faq-item {
    overflow: hidden;
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    -webkit-tap-highlight-color: transparent;
  }

  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    width: 100%;
    padding: var(--ni-16) var(--ni-20);

    background: none;
    border: none;
    cursor: pointer;

    color: inherit;
    font-family: inherit;
    text-align: start;
  }

  .faq-caret {
    display: inline-flex;
    flex-shrink: 0;
    transition: transform var(--transition-increment) ease-in-out;
    transform: rotate(90deg);

    &.is-open {
      transform: rotate(-90deg);
    }
  }

  .faq-answer {
    padding: 0 var(--ni-20) var(--ni-16);
  }
</style>
