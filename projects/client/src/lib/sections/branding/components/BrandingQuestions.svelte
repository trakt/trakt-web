<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<section class="branding-questions">
  <div class="branding-questions-inner">
    <div class="branding-questions-content">
      <h2 class="branding-section-heading">
        {m.heading_branding_questions()}
      </h2>
      <p class="secondary questions-intro">
        {m.text_branding_questions_intro()}
      </p>
    </div>
    <div class="questions-links">
      <Link
        href="https://github.com/trakt/trakt-api"
        target="_blank"
        rel="noopener noreferrer">API Docs</Link
      >
      <Link
        href="https://github.com/trakt/trakt-api/discussions"
        target="_blank"
        rel="noopener noreferrer">Dev Forum</Link
      >
    </div>
  </div>
</section>

<style lang="scss">
  .branding-questions {
    width: 100%;
  }

  .branding-questions-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);
    text-align: center;
  }

  .branding-questions-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    max-width: var(--ni-640);
  }

  .questions-intro {
    line-height: 1.6;
    font-size: var(--ni-16);
  }

  .questions-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-m);
    justify-content: center;
  }
</style>
