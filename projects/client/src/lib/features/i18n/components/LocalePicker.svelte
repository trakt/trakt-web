<script lang="ts">
  import NativeSelect from "$lib/components/select/NativeSelect.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import {
    type AvailableLocale,
    availableLocales,
  } from "$lib/features/i18n/index.ts";
  import { WorkerMessage } from "$worker/WorkerMessage";
  import { workerRequest } from "$worker/workerRequest";
  import { LocaleEndpoint } from "../LocaleEndpoint";
  import { useLocale } from "./useLocale";

  const locale = useLocale();
  const { track } = useTrack(AnalyticsEvent.Locale);

  async function submitLocale(value: string) {
    track({ locale: value });
    locale.set(value);

    await fetch(LocaleEndpoint.Set, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locale: value }),
    }).then((res) => res.text() as Promise<AvailableLocale>);

    await workerRequest(WorkerMessage.CacheBust);
  }

  const localeToFlag: Record<AvailableLocale, string> = {
    en: "🇺🇸",
    "en-AU": "🇦🇺",
    "fr-FR": "🇫🇷",
    "fr-CA": "🇨🇦",
    "ja-JP": "🇯🇵",
    "pt-BR": "🇧🇷",
    "es-ES": "🇪🇸",
    "es-MX": "🇲🇽",
    "de-DE": "🇩🇪",
    "ro-RO": "🇷🇴",
    "nl-NL": "🇳🇱",
    "uk-UA": "🇺🇦",
    "ru-RU": "🇷🇺",
    "pl-PL": "🇵🇱",
    "it-IT": "🇮🇹",
    "bg-BG": "🇧🇬",
    "sv-SE": "🇸🇪",
    "nb-NO": "🇳🇴",
    "da-DK": "🇩🇰",
    "zh-CN": "🇨🇳",
    "tr-TR": "🇹🇷",
    "hu-HU": "🇭🇺",
    "el-GR": "🇬🇷",
    "fa-IR": "🇮🇷",
    "pt-PT": "🇵🇹",
    "ca-ES": "🇪🇸",
    "id-ID": "🇮🇩",
  };

  const localeToTitle: Record<AvailableLocale, string> = {
    en: "English",
    "en-AU": "English (Australia)",
    "fr-FR": "Français",
    "fr-CA": "Français (Canada)",
    "ja-JP": "日本語",
    "pt-BR": "Português (Brasil)",
    "es-ES": "Español (España)",
    "es-MX": "Español (México)",
    "de-DE": "Deutsch",
    "ro-RO": "Română",
    "nl-NL": "Nederlands",
    "uk-UA": "Українська",
    "ru-RU": "Русский",
    "pl-PL": "Polski",
    "it-IT": "Italiano",
    "bg-BG": "Български",
    "sv-SE": "Svenska",
    "nb-NO": "Norsk (Bokmål)",
    "da-DK": "Dansk",
    "zh-CN": "中文 (简体)",
    "tr-TR": "Türkçe",
    "hu-HU": "Magyar",
    "el-GR": "Ελληνικά",
    "fa-IR": "فارسی",
    "pt-PT": "Português (Portugal)",
    "ca-ES": "Català",
    "id-ID": "Bahasa Indonesia",
  };

  const options = $derived(
    availableLocales.map((option) => ({
      value: option,
      text: `${localeToFlag[option]} ${localeToTitle[option]}`,
      label: localeToTitle[option],
    })),
  );

  const displayText = (value: AvailableLocale) => localeToTitle[value];
</script>

<NativeSelect
  value={$locale}
  onChange={submitLocale}
  {options}
  getDisplayText={displayText}
>
  {#snippet icon()}
    {localeToFlag[$locale]}
  {/snippet}
</NativeSelect>
