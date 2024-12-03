<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { AudienceProps } from "./AudienceProps";

  const { children, audience }: ChildrenProps & AudienceProps = $props();

  const { isAuthorized } = useAuth();
  const { user } = useUser();

  const isAvailableForAudience = $derived(
    (audience === "authenticated" && $isAuthorized && $user != null) ||
      (audience === "public" && !$isAuthorized),
  );
</script>

{#if isAvailableForAudience}
  {@render children()}
{/if}
