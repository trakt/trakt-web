<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ImporterCard from "./_internal/ImporterCard.svelte";
  import TvTimeNotice from "./_internal/TvTimeNotice.svelte";
</script>

<section class="trakt-welcome-import">
  <div class="welcome-import-header">
    <h2 class="welcome-import-heading">{m.welcome_import_heading()}</h2>
    <p class="secondary welcome-import-description">
      {m.welcome_import_description()}
    </p>
  </div>

  <TvTimeNotice />

  <div class="welcome-import-cards">
    <ImporterCard
      source="imdb"
      description={m.welcome_import_imdb_description()}
    />
    <ImporterCard
      source="letterboxd"
      description={m.welcome_import_letterboxd_description()}
    />
  </div>

  <div class="welcome-import-footer">
    <Button
      href={UrlBuilder.settings.data()}
      color="default"
      variant="primary"
      style="flat"
      size="small"
      label={m.welcome_import_browse_all()}
    >
      {m.welcome_import_browse_all()}
    </Button>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-welcome-import {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    width: 100%;
  }

  .welcome-import-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .welcome-import-heading {
    font-size: var(--ni-28);
    line-height: 1.15;

    @include for-mobile {
      font-size: var(--ni-24);
    }
  }

  .welcome-import-description {
    font-size: var(--ni-18);
    line-height: 1.6;

    max-width: var(--ni-640);

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }

  .welcome-import-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: 1fr;
    }
  }

  .welcome-import-footer {
    display: flex;
    justify-content: center;
  }
</style>
