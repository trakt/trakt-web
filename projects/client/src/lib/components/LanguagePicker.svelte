<script lang="ts">
  import {
    type AvailableLanguageTag,
    availableLanguageTags,
    languageTag,
    isAvailableLanguageTag,
  } from "$lib/paraglide/runtime.js";
  import { i18n } from "$lib/i18n.ts";
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
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    appearance: none;
  }

  select:focus {
    outline: none;
    border-color: #007bff;
  }
</style>
