<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type {
    ImportGuidelineField,
    ImportGuidelines,
    ImportNote,
  } from "../../import/ImportTypes.ts";

  function isStructuredNote(
    note: ImportNote,
  ): note is { text: string; values: string[] } {
    return typeof note === "object";
  }

  const {
    title,
    guidelines,
    onClose,
  }: { title: string; guidelines: ImportGuidelines; onClose: () => void } =
    $props();

  let isOpen = $state(false);
</script>

{#snippet guidelineField(field: ImportGuidelineField)}
  <div class="field-row">
    <div class="field-header">
      <code class="field-name bold">{field.name}</code>
      {#if field.optional}
        <span class="field-badge secondary">optional</span>
      {/if}
    </div>

    <p class="field-description">{field.description}</p>

    {#if field.note}
      {#if isStructuredNote(field.note)}
        <p class="italic secondary">
          {field.note.text}
          {#each field.note.values as value, i (i)}
            <code class="field-value">{value}</code>
            {#if i < field.note.values.length - 1},{/if}
          {/each}
        </p>
      {:else}
        <p class="italic secondary">{field.note}</p>
      {/if}
    {/if}
  </div>
{/snippet}

<Drawer {onClose} {title} size="large" onOpened={() => (isOpen = true)}>
  {#if isOpen}
    <div class="guidelines-content">
      <section class="guidelines-section">
        <p class="guidelines-intro">{guidelines.intro}</p>
      </section>

      <section class="guidelines-section">
        <span class="bold">{m.header_import_fields()}</span>
        <div class="fields-list">
          {#each guidelines.fields as field (field.name)}
            {@render guidelineField(field)}
          {/each}
        </div>
      </section>

      <section class="guidelines-section">
        <span class="bold">{m.header_import_example()}</span>
        <div class="code-block">
          <pre><code>{guidelines.example}</code></pre>
        </div>
      </section>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .guidelines-content,
  .fields-list,
  .guidelines-section,
  .field-row {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .fields-list,
  .field-row {
    gap: var(--gap-xs);
  }

  .guidelines-section {
    gap: var(--gap-s);
  }

  .field-row {
    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-m);

    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);
  }

  .field-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .field-name,
  .field-value {
    color: var(--purple-500);
  }

  .field-badge {
    font-size: var(--font-size-tag);

    border: var(--ni-1) solid var(--color-border);
    border-radius: var(--border-radius-xs);

    padding: var(--ni-2) var(--ni-6);
  }

  .field-value {
    padding: 0 var(--ni-6);
  }

  .code-block {
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    overflow-x: auto;
    overflow-y: hidden;
    min-width: 0;

    pre {
      margin: 0;
      padding: var(--ni-20) var(--ni-24);
    }
  }
</style>
