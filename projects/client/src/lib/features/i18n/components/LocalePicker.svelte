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
    "en-au": "🇦🇺",
    "fr-fr": "🇫🇷",
    "fr-ca": "🇨🇦",
    "ja-jp": "🇯🇵",
    "pt-br": "🇧🇷",
    "es-es": "🇪🇸",
    "es-mx": "🇲🇽",
    "de-de": "🇩🇪",
    "ro-ro": "🇷🇴",
    "nl-nl": "🇳🇱",
    "uk-ua": "🇺🇦",
    "ru-ru": "🇷🇺",
    "pl-pl": "🇵🇱",
    "it-it": "🇮🇹",
    "bg-bg": "🇧🇬",
    "sv-se": "🇸🇪",
    "nb-no": "🇳🇴",
    "da-dk": "🇩🇰",
    "zh-cn": "🇨🇳",
    "tr-tr": "🇹🇷",
  };

  const localeToTitle: Record<AvailableLocale, string> = {
    en: "English",
    "en-au": "English (Australia)",
    "fr-fr": "Français",
    "fr-ca": "Français (Canada)",
    "ja-jp": "日本語",
    "pt-br": "Português (Brasil)",
    "es-es": "Español (España)",
    "es-mx": "Español (México)",
    "de-de": "Deutsch",
    "ro-ro": "Română",
    "nl-nl": "Nederlands",
    "uk-ua": "Українська",
    "ru-ru": "Русский",
    "pl-pl": "Polski",
    "it-it": "Italiano",
    "bg-bg": "Български",
    "sv-se": "Svenska",
    "nb-no": "Norsk (Bokmål)",
    "da-dk": "Dansk",
    "zh-cn": "中文 (简体)",
    "tr-tr": "Türkçe",
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
