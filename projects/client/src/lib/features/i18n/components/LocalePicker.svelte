<script lang="ts">
  import {
    type AvailableLocale,
    availableLocales,
  } from "$lib/features/i18n/index.ts";
  import { LocaleEndpoint } from "../LocaleEndpoint";
  import { useLocale } from "./useLocale";

  const locale = useLocale();

  async function submitLocale(value: string) {
    locale.set(value);

    await fetch(LocaleEndpoint.Set, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locale: value }),
    }).then((res) => res.text() as Promise<AvailableLocale>);
  }

  const localeToFlag: Record<AvailableLocale, string> = {
    en: "🇬🇧",
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
  };

  const localeToTitle: Record<AvailableLocale, string> = {
    en: "English",
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
  };
</script>

<div class="locale-picker-container">
  <svg
    class="locale-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    fill="currentColor"
  >
    <path
      d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"
    />
  </svg>
  <select onchange={(ev) => submitLocale(ev.currentTarget.value)}>
    {#each availableLocales as option}
      <option
        selected={$locale === option}
        value={option}
        aria-label={localeToTitle[option]}
      >
        {localeToFlag[option]}
        {localeToTitle[option]}
      </option>
    {/each}
  </select>
</div>

<style lang="scss">
  @use "../../../../style/mixins/index" as *;

  .locale-picker-container {
    position: relative;
    width: var(--ni-48);
    height: var(--ni-48);
    border-radius: 50%;

    .locale-icon {
      /** Scale 90% to visually compensate */
      width: calc(var(--ni-32) * 0.9);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    @include mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-background) 30%,
          transparent 70%
        );
      }
    }
  }

  select {
    width: 100%;
    height: 100%;
    font-size: var(--ni-16);
    border: none;
    background-color: transparent;
    text-align: center;
    appearance: none;
    cursor: pointer;
    opacity: 0;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
  }
</style>
