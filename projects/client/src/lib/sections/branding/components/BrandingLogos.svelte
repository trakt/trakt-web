<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { error } from "$lib/utils/console/print.ts";
  import { downloadFile } from "$lib/utils/file/downloadFile.ts";
  import { zipBlobs } from "$lib/utils/file/zipBlobs.ts";
  import type { BrandingBackdrop } from "../models/BrandingBackdrop.ts";
  import type { LogoFormat } from "../models/LogoFormat.ts";
  import type { LogoSize } from "../models/LogoSize.ts";
  import type { BrandingLogo } from "./_internal/BrandingLogo.ts";
  import BrandingTile from "./_internal/BrandingTile.svelte";
  import DownloadPreferences from "./_internal/DownloadPreferences.svelte";
  import { galleryLogos } from "./_internal/galleryLogos.ts";
  import { monoLogos } from "./_internal/monoLogos.ts";
  import { renderAllLogos } from "./_internal/renderAllLogos.ts";
  import { renderLogo } from "./_internal/renderLogo.ts";
  import { toBrandingBackdrop } from "./_internal/toBrandingBackdrop.ts";
  import { toLogoFilename } from "./_internal/toLogoFilename.ts";

  const { track } = useTrack(AnalyticsEvent.BrandingDownload);

  const BACKDROP_PARAM = "backdrop";
  const MAX_STAGGER_MS = 320;
  const STAGGER_STEP_MS = 80;

  let section = $state<HTMLElement>();
  let format = $state<LogoFormat>("svg");
  let size = $state<LogoSize>(1024);
  let isZipping = $state(false);

  const backdrop = $derived(
    toBrandingBackdrop(page.url.searchParams.get(BACKDROP_PARAM)),
  );

  const backdropOptions = $derived([
    { value: "light" as const, text: m.text_branding_backdrop_light() },
    { value: "dark" as const, text: m.text_branding_backdrop_dark() },
    { value: "brand" as const, text: m.text_branding_backdrop_brand() },
    {
      value: "transparent" as const,
      text: m.text_branding_backdrop_transparent(),
    },
  ]);

  const trackedSize = $derived(format === "svg" ? "vector" : size);
  const revealDelay = (index: number) =>
    Math.min(index * STAGGER_STEP_MS, MAX_STAGGER_MS);

  const changeBackdrop = (value: BrandingBackdrop) => {
    const url = new URL(page.url);
    url.searchParams.set(BACKDROP_PARAM, value);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, { replaceState: true, keepFocus: true, noScroll: true });
  };

  type DownloadParams = {
    logo: BrandingLogo;
    element: HTMLElement;
    format: LogoFormat;
  };

  const downloadLogo = async ({
    logo,
    element,
    format: chosen,
  }: DownloadParams) => {
    const logoBackdrop = logo.fixedBackdrop ?? backdrop;

    try {
      const blob = await renderLogo({
        element,
        format: chosen,
        size,
        backdrop: logoBackdrop,
      });
      if (!blob) return;

      downloadFile(
        blob,
        toLogoFilename({
          name: logo.name,
          format: chosen,
          size,
          backdrop: logo.fixedBackdrop ? undefined : backdrop,
        }),
      );
      track({
        format: chosen,
        size: chosen === "svg" ? "vector" : size,
        scope: "logo",
        backdrop: logoBackdrop,
      });
    } catch (cause) {
      error("Could not download the logo", cause);
    }
  };

  export async function downloadAll() {
    if (!section || isZipping) return;

    isZipping = true;
    try {
      const rendered = await renderAllLogos({
        section,
        logos: [...galleryLogos, ...monoLogos],
        backdrop,
        format,
        size,
      });

      downloadFile(
        await zipBlobs(rendered),
        format === "svg"
          ? "trakt-logos-svg.zip"
          : `trakt-logos-${format}-${size}.zip`,
      );
      track({ format, size: trackedSize, scope: "kit", backdrop });
    } catch (cause) {
      error("Could not download the logo kit", cause);
    } finally {
      isZipping = false;
    }
  }
</script>

<div class="trakt-branding-logos" bind:this={section}>
  <section class="branding-logo-section">
    <div class="branding-section-header">
      <h2 class="branding-section-heading">{m.heading_branding_logos()}</h2>
      <p class="branding-section-desc secondary">
        {m.text_branding_default_logos_desc()}
      </p>
    </div>

    <div class="branding-logo-controls">
      <SegmentedSelect
        options={backdropOptions}
        value={backdrop}
        ariaLabel={m.label_branding_backdrop()}
        onChange={changeBackdrop}
      />
      <DownloadPreferences
        {format}
        {size}
        isBusy={isZipping}
        onFormatChange={(value) => (format = value)}
        onSizeChange={(value) => (size = value)}
        onDownloadAll={downloadAll}
      />
    </div>

    <div class="logo-grid">
      {#each galleryLogos as logo, index (logo.key)}
        <BrandingTile
          {logo}
          {backdrop}
          {format}
          revealDelay={revealDelay(index)}
          onDownload={(params) => downloadLogo({ logo, ...params })}
        />
      {/each}
    </div>
  </section>

  <section class="branding-logo-section">
    <div class="branding-section-header">
      <h2 class="branding-section-heading">
        {m.heading_branding_alternative_logos()}
      </h2>
      <p class="branding-section-desc secondary">
        {m.text_branding_alt_logos_desc()}
      </p>
    </div>

    <div class="logo-grid">
      {#each monoLogos as logo, index (logo.key)}
        <BrandingTile
          {logo}
          backdrop={logo.fixedBackdrop ?? "light"}
          {format}
          revealDelay={revealDelay(index)}
          onDownload={(params) => downloadLogo({ logo, ...params })}
        />
      {/each}
    </div>
  </section>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-branding-logos {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);
    width: 100%;
  }

  .branding-logo-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .branding-section-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .branding-section-desc {
    line-height: 1.6;
    max-width: var(--ni-640);
  }

  .branding-logo-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
    min-height: var(--ni-48);
  }

  .logo-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--gap-m);

    @include for-tablet-sm-and-below {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
