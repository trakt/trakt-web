<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import type { PageData } from "./$types";

  import * as m from "$lib/features/i18n/messages.ts";

  export let data: PageData;
</script>

<div class="trakt-content">
  <div class="trakt-theme-selector">
    <ThemePicker theme={data.theme} />
  </div>

  <div class="trakt-language-picker">
    <LocalePicker />
  </div>

  <div class="trakt-logo">
    <h2>{m.hello_world({ name: "Sefer" })}</h2>

    <Logo />
  </div>
</div>

<style>
  .trakt-content {
    width: 40vw;
    min-width: 150px;
    inset: 0;
    margin: auto;
    margin-top: 5em;
  }

  .trakt-language-picker {
    position: fixed;
    top: 1em;
    right: 1em;
  }

  .trakt-theme-selector {
    position: fixed;
    top: 1em;
    left: 1em;
  }

  .trakt-logo {
    display: block;

    h2 {
      font-size: max(2em, 2vw);
      margin-bottom: 1em;
    }
  }
</style>
