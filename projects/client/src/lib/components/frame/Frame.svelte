<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { fitFrameToContent } from "./_internal/fitFrameToContent";

  type FrameProps = {
    slug: string;
    title: string;
    urlBuilder: (slug: string, token: string | Nil) => HttpsUrl;
  };

  const { slug: userSlug, title, urlBuilder }: FrameProps = $props();

  const { user } = useUser();

  const isMe = $derived(userSlug === "me" || userSlug === $user.slug);
  const slug = $derived(isMe ? $user.slug : userSlug);
  const token = $derived(isMe ? $user.token : null);
</script>

<iframe
  class="trakt-og-frame"
  {title}
  src={urlBuilder(slug, token)}
  use:fitFrameToContent
></iframe>

<style>
  iframe {
    width: 100%;
    border: none;
  }
</style>
