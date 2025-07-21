<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { frameListener } from "./_internal/frameListener";

  type FrameProps = {
    slug: string;
    title: string;
    urlBuilder: (slug: string, token: string | Nil) => HttpsUrl;
  };

  const { slug: userSlug, title, urlBuilder }: FrameProps = $props();

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(userSlug));

  const slug = $derived($isMe ? $user.slug : userSlug);
  const token = $derived($isMe ? $user.token : null);
</script>

<iframe
  class="trakt-og-frame"
  {title}
  src={urlBuilder(slug, token)}
  use:frameListener={slug}
></iframe>

<style>
  iframe {
    width: 100%;
    height: 100dvh;
    border: none;
    overflow: hidden;
  }
</style>
