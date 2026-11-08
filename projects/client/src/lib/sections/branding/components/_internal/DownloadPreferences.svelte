<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { LogoFormat } from "../../models/LogoFormat.ts";
  import type { LogoSize } from "../../models/LogoSize.ts";

  type DownloadPreferencesProps = {
    format: LogoFormat;
    size: LogoSize;
    isBusy: boolean;
    onFormatChange: (format: LogoFormat) => void;
    onSizeChange: (size: LogoSize) => void;
    onDownloadAll: () => void;
  };

  const {
    format,
    size,
    isBusy,
    onFormatChange,
    onSizeChange,
    onDownloadAll,
  }: DownloadPreferencesProps = $props();

  const formatOptions = [
    { value: "svg", text: "SVG" },
    { value: "png", text: "PNG" },
    { value: "jpg", text: "JPG" },
    { value: "webp", text: "WebP" },
  ] as const;

  const sizes = [512, 1024, 2048] as const satisfies ReadonlyArray<LogoSize>;

  const sizeOptions = sizes.map((value) => ({
    value: String(value),
    text: String(value),
  }));
</script>

<div class="trakt-download-preferences">
  <SegmentedSelect
    options={formatOptions}
    value={format}
    ariaLabel={m.label_branding_download_format()}
    onChange={onFormatChange}
  />
  <SegmentedSelect
    options={sizeOptions}
    value={String(size)}
    disabled={format === "svg"}
    ariaLabel={m.label_branding_download_size()}
    onChange={(value) =>
      onSizeChange(sizes.find((option) => String(option) === value) ?? size)}
  />
  <Button
    label={m.button_text_branding_download_all()}
    size="small"
    variant="secondary"
    color="purple"
    disabled={isBusy}
    onclick={onDownloadAll}
  >
    {m.button_text_branding_download_all()}
  </Button>
</div>

<style lang="scss">
  .trakt-download-preferences {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
