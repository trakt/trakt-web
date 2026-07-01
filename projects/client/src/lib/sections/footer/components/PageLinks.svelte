<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { user } = useUser();
</script>

<div class="trakt-page-links">
  <div class="trakt-link-group">
    <span class="secondary">{m.text_footer_category_platform()}</span>
    <Link href={UrlBuilder.about()}>
      <span class="bold">{m.link_text_about()}</span>
    </Link>
    <Link href={UrlBuilder.vip()}>
      <span class="bold">VIP</span>
    </Link>
    <Link
      href={UrlBuilder.docs.api()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="bold">{m.link_text_api()}</span>
    </Link>
  </div>

  <div class="trakt-link-group">
    <span class="secondary">{m.text_footer_category_community()}</span>
    <Link
      href={UrlBuilder.og.forums()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="bold">{m.link_text_forums()}</span>
    </Link>
    <RenderFor audience="vip">
      <Link
        href={UrlBuilder.og.support($user?.slug)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="bold">{m.link_text_support()}</span>
      </Link>
      <Link
        href={UrlBuilder.feedback()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="bold">{m.link_text_feedback()}</span>
      </Link>
    </RenderFor>
  </div>

  <div class="trakt-link-group">
    <span class="secondary">{m.text_footer_category_legal()}</span>
    <Link href={UrlBuilder.terms()}>
      <span class="bold">{m.link_text_terms()}</span>
    </Link>
    <Link href={UrlBuilder.privacy()}>
      <span class="bold">{m.link_text_privacy()}</span>
    </Link>
    <Link href={UrlBuilder.branding()}>
      <span class="bold">{m.link_text_branding()}</span>
    </Link>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-page-links {
    display: flex;
    gap: var(--gap-xxl);

    @include for-mobile() {
      gap: var(--gap-l);
    }
  }

  .trakt-link-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .trakt-link-group :global(.trakt-link) {
    text-decoration: none;
  }
</style>
