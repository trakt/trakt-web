<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  const currentYear = new Date().getFullYear();
</script>

<div class="trakt-copyright">
  <p class="secondary meta-info">
    © 2010-{currentYear} trakt, inc. {m.text_copyright_notice()}
  </p>
  <p class="secondary meta-info">{m.text_copyright_crafted_by()}</p>
</div>

<style>
  .trakt-copyright {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    width: fit-content;
  }
</style>
