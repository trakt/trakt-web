<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import Footer from "$lib/sections/footer/Footer.svelte";
  import { frameListener } from "./_internal/frameListener";

  type FrameProps = {
    slug: string;
    title: string;
    urlBuilder: (slug: string, token: string | Nil) => HttpsUrl;
    mode?: "contain" | "cover";
    source: string;
  };

  const {
    slug: userSlug,
    title,
    urlBuilder,
    mode = "contain",
    source,
  }: FrameProps = $props();

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(userSlug));

  const slug = $derived($isMe ? $user.slug : userSlug);
  const token = $derived($isMe ? $user.token : null);
</script>

<div class="trakt-frame-container" data-mode={mode}>
  <iframe
    class="trakt-og-frame"
    {title}
    src={urlBuilder(slug, token)}
    use:frameListener={{ slug, source }}
  ></iframe>

  <Footer />
  <div class="trakt-frame-spacer"></div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-frame-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .trakt-frame-spacer {
      height: 0;
    }

    &[data-mode="cover"] {
      position: absolute;
      top: 0;
      left: 0;

      @include for-tablet-sm-and-below {
        .trakt-frame-spacer {
          height: var(--mobile-navbar-height);
        }
      }
    }
  }

  iframe {
    width: 100%;
    height: 100dvh;
    border: none;
    overflow: hidden;
  }
</style>
