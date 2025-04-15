<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";

  const { size }: { size: "small" | "tag" } = $props();

  const { logout } = useAuth();
</script>

<Button
  {size}
  onclick={logout}
  label={m.logout()}
  color="red"
  style="flat"
  variant="secondary"
>
  {m.logout()}
</Button>
