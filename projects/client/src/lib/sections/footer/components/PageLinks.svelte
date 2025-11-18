<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { user } = useUser();
</script>

<div class="trakt-page-links">
  <RenderFor audience="vip">
    <Link href={UrlBuilder.og.support($user?.slug)} target="_blank">
      <span class="meta-info">{m.link_text_support()}</span>
    </Link>
  </RenderFor>

  <Link href={UrlBuilder.og.forums()} target="_blank">
    <span class="meta-info">{m.link_text_forums()}</span>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-page-links {
    display: flex;
    gap: var(--gap-l);

    .meta-info {
      transition: font-size var(--transition-increment) ease-in-out;
      font-size: var(--ni-14);
    }

    :global(.trakt-link) {
      text-decoration: none;
    }

    @include for-mobile {
      .meta-info {
        font-size: var(--ni-12);
      }
    }
  }
</style>
