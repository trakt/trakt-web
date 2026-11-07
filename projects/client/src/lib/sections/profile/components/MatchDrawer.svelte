<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserMatch } from "$lib/requests/models/UserMatch";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps.ts";
  import MatchBreakdown from "./MatchBreakdown.svelte";

  type MatchDrawerProps = {
    onClose: () => void;
    match?: UserMatch;
  } & Pick<DisplayableProfileProps, "profile">;

  const { onClose, match, profile }: MatchDrawerProps = $props();

  const { user } = useUser();
</script>

<Drawer {onClose} title={m.match_drawer_title()} size="auto">
  <MatchBreakdown {match} user={$user} {profile} />
</Drawer>
