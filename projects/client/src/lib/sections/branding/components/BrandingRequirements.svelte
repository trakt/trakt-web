<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  const REQUIREMENTS = [
    m.text_branding_req_1,
    m.text_branding_req_2,
    m.text_branding_req_3,
    m.text_branding_req_4,
    m.text_branding_req_5,
    m.text_branding_req_6,
  ] as const;
</script>

<section class="branding-requirements">
  <h2 class="branding-section-heading">{m.heading_branding_requirements()}</h2>
  <ul class="branding-requirements-list">
    {#each REQUIREMENTS as req, i (i)}
      <li>{req()}</li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .branding-requirements {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .branding-requirements-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    padding-left: var(--gap-l);

    li {
      font-size: var(--font-size-text);
      line-height: 1.6;
    }
  }
</style>
