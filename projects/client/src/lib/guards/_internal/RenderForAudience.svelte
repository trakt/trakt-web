<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { IS_DEV } from "$lib/utils/env";

  const { children, audience }: ChildrenProps & AudienceProps = $props();

  const { isAuthorized } = useAuth();
  const { user } = useUser();

  const isAvailableForAudience = $derived(
    audience === "all" ||
      (audience === "authenticated" && $isAuthorized && $user != null) ||
      (audience === "public" && !$isAuthorized) ||
      (audience === "director" &&
        $isAuthorized &&
        ($user?.isDirector || IS_DEV)) ||
      (audience === "vip" && $isAuthorized && $user?.isVip) ||
      (audience === "free" && $isAuthorized && !$user?.isVip),
  );
</script>

{#if isAvailableForAudience}
  {@render children()}
{/if}
