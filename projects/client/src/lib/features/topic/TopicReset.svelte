<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { applyTopicPaint } from "./applyTopicPaint.ts";
  import { writeTopicCache } from "./writeTopicCache.ts";

  const { isAuthorized } = useAuth();
  const { user } = useUser();

  const isSettled = $derived(!$isAuthorized || $user != null);

  $effect(() => {
    if (!isSettled) return;

    writeTopicCache(null);
    applyTopicPaint(null);
    document.documentElement.removeAttribute("data-topic");
    document.documentElement.removeAttribute("data-dd-side");
  });
</script>
