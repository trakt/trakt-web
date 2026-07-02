<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";
  import type {
    ImportSourceConfig,
    StepSegment,
  } from "../../import/ImportTypes.ts";
  import {
    ImportDrawers,
    importDrawerNavigation,
  } from "./importDrawerNavigation.ts";

  const { config, collapsed = false }: {
    config: ImportSourceConfig;
    collapsed?: boolean;
  } = $props();

  const { buildDrawerLink } = importDrawerNavigation();

  let expanded = $state(false);
  const isCollapsed = $derived(collapsed && !expanded);

  const guidelinesLink = $derived.by(() => {
    switch (config.id) {
      case "trakt-json":
        return buildDrawerLink(ImportDrawers.JsonGuidelines);
      case "trakt-csv":
        return buildDrawerLink(ImportDrawers.CsvGuidelines);
    }
  });
</script>

{#snippet segment(stepSegment: StepSegment)}
  {#if typeof stepSegment === "string"}
    {stepSegment}
  {:else}
    <Link href={stepSegment.href} target="_blank" rel="noopener noreferrer">
      {stepSegment.text}
    </Link>
  {/if}
{/snippet}

<div class="trakt-import-guide" class:is-collapsed={isCollapsed}>
  {#if collapsed}
    <button
      type="button"
      class="import-guide-toggle"
      aria-expanded={!isCollapsed}
      aria-controls="import-guide-body"
      onclick={() => (expanded = !expanded)}
    >
      <span class="import-guide-title bold ellipsis">{config.guide.title}</span>
      <span class="import-guide-caret" class:is-open={!isCollapsed}>
        <CaretRightIcon />
      </span>
    </button>
  {:else}
    <p class="import-guide-title bold">{config.guide.title}</p>
  {/if}

  {#if !isCollapsed}
    <div
      id="import-guide-body"
      class="import-guide-body"
      transition:slide={{ duration: 150, axis: "y" }}
    >
      {#if config.guide.description != null}
        <p class="secondary">{config.guide.description}</p>
      {/if}

      {#if config.guide.steps != null}
        <ol class="import-guide-steps">
          {#each config.guide.steps as step, i (i)}
            <li>
              <p class="secondary">
                {#each step as stepSegment, j (j)}
                  {#if j > 0}" "{/if}
                  {@render segment(stepSegment)}
                {/each}
              </p>
            </li>
          {/each}
        </ol>
      {/if}

      {#if guidelinesLink}
        <div class="import-guide-action">
          <Button
            {...guidelinesLink}
            variant="primary"
            color="default"
            size="small"
            label={m.button_label_view_import_guidelines()}
          >
            {m.button_text_view_import_guidelines()}
          </Button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-import-guide {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-20) var(--ni-24);
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    &.is-collapsed {
      padding: var(--ni-12) var(--ni-16);
    }
  }

  .import-guide-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    width: 100%;
    padding: 0;

    background: none;
    border: none;
    cursor: pointer;

    color: inherit;
    font-family: inherit;
    text-align: start;

    .import-guide-title {
      min-width: 0;
    }
  }

  .import-guide-caret {
    display: inline-flex;
    flex-shrink: 0;
    transition: transform var(--transition-increment) ease-in-out;
    transform: rotate(90deg);

    &.is-open {
      transform: rotate(-90deg);
    }
  }

  .import-guide-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .import-guide-steps {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin: 0;
    padding-inline-start: var(--ni-20);
  }

  .import-guide-action {
    display: flex;
    justify-content: flex-end;
  }
</style>
