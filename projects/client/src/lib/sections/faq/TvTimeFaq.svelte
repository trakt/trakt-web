<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TvTimeFaqList from "./_internal/TvTimeFaqList.svelte";
  import TvTimeReportForm from "./_internal/TvTimeReportForm.svelte";
</script>

<section class="trakt-tv-time-faq">
  <header class="faq-header">
    <h1 class="faq-title">{m.tv_time_faq_page_title()}</h1>
    <p class="secondary faq-description">
      {m.tv_time_faq_page_description()}
    </p>
  </header>

  <TvTimeFaqList />

  <RenderFor audience="authenticated">
    <TvTimeReportForm />
  </RenderFor>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-tv-time-faq {
    --top-bottom-padding: var(--ni-48);

    align-self: center;
    width: 100%;
    max-width: var(--ni-768);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    padding: var(--top-bottom-padding) var(--layout-distance-side);

    transition: padding var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      --top-bottom-padding: var(--ni-24);
    }
  }

  .faq-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    text-align: center;
  }

  .faq-title {
    font-size: var(--ni-32);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;

    transition: font-size var(--transition-increment) ease-in-out;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .faq-description {
    font-size: var(--ni-18);
    line-height: 1.7;

    max-width: var(--ni-640);

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }

  :global(html:has(.trakt-tv-time-faq)) {
    @include for-mouse {
      overflow-y: scroll;
    }
  }
</style>
