<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import type {
    ImportSourceConfig,
    StepSegment,
  } from "../../import/ImportTypes.ts";
  import {
    ImportDrawers,
    importDrawerNavigation,
  } from "./importDrawerNavigation.ts";

  const { config }: { config: ImportSourceConfig } = $props();

  const { buildDrawerLink } = importDrawerNavigation();

  const guidelinesHref = $derived.by(() => {
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

<div class="import-guide">
  <p class="import-guide-title bold">{config.guide.title}</p>

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

  {#if guidelinesHref}
    <div class="import-guide-action">
      <Button
        href={guidelinesHref}
        noscroll
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

<style lang="scss">
  .import-guide {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-20) var(--ni-24);
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);
  }

  .import-guide-steps {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin: 0;
    padding-left: var(--ni-20);
  }

  .import-guide-action {
    display: flex;
    justify-content: flex-end;
  }
</style>
