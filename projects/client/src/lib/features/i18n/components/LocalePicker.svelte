<script lang="ts">
  import {
    type AvailableLanguageTag,
    availableLanguageTags,
    languageTag,
    isAvailableLanguageTag,
    i18n,
  } from "$lib/features/i18n/index.ts";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  function switchToLanguage(newLanguage: string) {
    if (!isAvailableLanguageTag(newLanguage)) {
      console.error(`Invalid language tag: ${newLanguage}`);
      return;
    }

    const canonicalPath = i18n.route($page.url.pathname);
    const localizedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localizedPath);
  }

  const tagToFlag: Record<AvailableLanguageTag, string> = {
    en: "🇬🇧",
    fr: "🇫🇷",
  };

  const tagToTitle: Record<AvailableLanguageTag, string> = {
    en: "English",
    fr: "Français",
  };

  const currentLanguage = languageTag();
</script>

<div class="container">
  <select onchange={(ev) => switchToLanguage(ev.currentTarget.value)}>
    {#each availableLanguageTags as tag}
      <option selected={currentLanguage == tag} value={tag}>
        {tagToTitle[tag]}
        {tagToFlag[tag]}
      </option>
    {/each}
  </select>
</div>

<style>
  .container {
    width: 10em;
    margin: auto;
    text-align: center;
    font-family: Arial, sans-serif;
  }

  select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid var(--color-foreground);
    border-radius: 5px;
    color: var(--color-foreground);
    background-color: color-mix(
      in srgb,
      var(--color-background) 85%,
      var(--color-foreground) 15%
    );
    appearance: none;

    transition-property: background-color, color, border;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
  }
</style>
