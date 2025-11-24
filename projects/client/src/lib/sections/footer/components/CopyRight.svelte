<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  const currentYear = new Date().getFullYear();
  const copyright = $derived(`© 2010-${currentYear} trakt, inc.`);
</script>

{#snippet content(copyrightText: string, subtitleText: string)}
  <p class="secondary bold">
    {copyrightText}
  </p>
  <p class="secondary bold">
    {subtitleText}
  </p>
{/snippet}

<div class="trakt-copyright">
  <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
    {@render content(
      `${copyright} ${m.text_copyright_notice()}`,
      m.text_copyright_crafted_by(),
    )}
  </RenderFor>

  <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
    {@render content(copyright, m.text_copyright_notice())}
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-copyright {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    width: fit-content;
  }
</style>
