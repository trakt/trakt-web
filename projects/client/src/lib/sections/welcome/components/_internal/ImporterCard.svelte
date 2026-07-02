<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    IMPORT_SOURCE_CONFIGS,
    type ImportSource,
  } from "$lib/sections/settings/import/ImportTypes.ts";
  import { importSourceHref } from "./importSourceHref.ts";

  const {
    description,
    source,
  }: {
    description: string;
    source: ImportSource;
  } = $props();

  const name = $derived(IMPORT_SOURCE_CONFIGS[source].name);
  const actionLabel = $derived(m.welcome_import_action({ service: name }));
  const href = $derived(importSourceHref(source));
</script>

<div class="trakt-importer-card">
  <div class="importer-card-content">
    <h3 class="importer-card-title">{name}</h3>
    <p class="secondary importer-card-description">{description}</p>
  </div>
  <Button
    {href}
    color="default"
    variant="secondary"
    style="flat"
    size="small"
    label={actionLabel}
  >
    {actionLabel}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-importer-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    justify-content: space-between;

    padding: var(--gap-l);

    background: color-mix(
      in srgb,
      var(--color-card-background) 80%,
      transparent
    );
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--border-radius-xl);

    transition:
      border-color var(--transition-increment) ease-in-out,
      background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        border-color: color-mix(in srgb, var(--purple-500) 40%, transparent);
        background: color-mix(
          in srgb,
          var(--color-card-background) 95%,
          var(--purple-500) 5%
        );
      }
    }
  }

  .importer-card-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .importer-card-title {
    font-weight: 600;
    font-size: var(--font-size-title);
  }

  .importer-card-description {
    font-size: var(--ni-12);
    line-height: 1.6;
  }
</style>
