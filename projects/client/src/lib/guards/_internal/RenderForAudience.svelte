<script lang="ts">
  import { useToken } from "$lib/features/auth/stores/useToken";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { AudienceProps } from "./AudienceProps";

  const { children, audience }: ChildrenProps & AudienceProps = $props();

  const { isAuthorized } = useToken();
  const { user } = useUser();

  const isAvailableForAudience = $derived(
    (audience === "authenticated" && $isAuthorized && $user != null) ||
      (audience === "public" && !$isAuthorized),
  );
</script>

{#if isAvailableForAudience}
  {@render children()}
{/if}
