<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";

  const { url } = useAuth();
</script>

<Link href={$url} target="_blank" color="inherit">
  <Button
    label={m.join_trakt_button_label()}
    style="flat"
    size="small"
    variant="secondary">{m.join_trakt_button()}</Button
  >
</Link>
