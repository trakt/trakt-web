<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { SeasonRecap } from "$lib/requests/models/SeasonRecap.ts";
  import type { Snippet } from "svelte";
  import RecapChapters from "./RecapChapters.svelte";

  const { chapters }: { chapters: SeasonRecap["chapters"] } = $props();

  const PREVIEW_ROW_WIDTHS = ["56%", "70%", "48%"];
</script>

{#snippet upsell()}
  <div class="in-depth-locked">
    <div class="locked-preview" aria-hidden="true">
      {#each PREVIEW_ROW_WIDTHS as width (width)}
        <div class="preview-row">
          <span class="preview-number"></span>
          <span class="preview-title" style:--preview-width={width}></span>
        </div>
      {/each}
    </div>

    <p class="small secondary locked-caption">
      <LockIcon />
      {m.text_recap_in_depth_locked()}
    </p>
  </div>

  <UpsellCta source="season-recap">
    {m.text_recap_upsell_in_depth()}
  </UpsellCta>
{/snippet}

{#snippet section(content: Snippet)}
  <section class="trakt-recap-in-depth">
    <div class="in-depth-header">
      <h3>{m.header_recap_in_depth()}</h3>
      <VipBadge />
    </div>

    {@render content()}
  </section>
{/snippet}

{#snippet chaptersContent()}
  <RecapChapters {chapters} />
{/snippet}

<RenderFor audience="vip">
  {#if chapters.length > 0}
    {@render section(chaptersContent)}
  {/if}
</RenderFor>

<RenderFor audience="free">
  {@render section(upsell)}
</RenderFor>

<RenderFor audience="public">
  {@render section(upsell)}
</RenderFor>

<style lang="scss">
  .trakt-recap-in-depth {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .in-depth-header {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .in-depth-locked {
      position: relative;

      overflow: hidden;
      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
    }

    .locked-preview {
      display: flex;
      flex-direction: column;
    }

    .preview-row {
      display: flex;
      align-items: center;
      gap: var(--gap-s);

      height: var(--ni-52);
      padding-inline: var(--ni-14);

      &:not(:first-child) {
        border-top: var(--border-thickness-xxs) solid
          color-mix(in srgb, var(--color-text-primary) 8%, transparent);
      }
    }

    .preview-number {
      width: var(--ni-28);
      height: var(--ni-28);
      border-radius: 50%;
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 10%,
        transparent
      );
    }

    .preview-title {
      width: var(--preview-width);
      height: var(--ni-10);
      border-radius: var(--ni-4);
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 10%,
        transparent
      );
    }

    .locked-caption {
      position: absolute;
      inset: 0;

      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: var(--gap-xs);

      padding-bottom: var(--gap-s);
      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--color-card-background) 85%, transparent) 70%
      );

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }
  }
</style>
