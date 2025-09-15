<script lang="ts">
  import { getAuthContext } from "$lib/features/auth/stores/getAuthContext.ts";
  import { onDestroy } from "svelte";
  import { createConnection } from "./createConnection.ts";
  import { destroySocket } from "./destroySocket.ts";

  const { token } = getAuthContext();

  let socket = $state<WebSocket | Nil>(null);

  token.subscribe(($token) => {
    socket = createConnection(socket, $token?.value);
  });

  onDestroy(() => destroySocket(socket));
</script>
