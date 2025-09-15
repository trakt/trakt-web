<script lang="ts">
  import { getAuthContext } from "$lib/features/auth/stores/getAuthContext.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator";
  import { LogLevel, print } from "$lib/utils/console/print";
  import { setMarker } from "$lib/utils/date/Marker";
  import { onDestroy } from "svelte";
  import { createConnection } from "./createConnection.ts";
  import { destroySocket } from "./destroySocket.ts";
  import type { WebSocketData } from "./WebSocketData.ts";

  const { token } = getAuthContext();
  const { invalidate } = useInvalidator();

  let socket = $state<WebSocket | Nil>(null);

  function wsInvalidate(event: MessageEvent) {
    try {
      const data: WebSocketData = JSON.parse(event.data);
      setMarker();

      switch (data.key) {
        case "show:watchlist":
          return invalidate("invalidate:watchlisted:show");
        case "movie:watchlist":
          return invalidate("invalidate:watchlisted:movie");
        case "episode:watched":
          /**
           * FIXME: add specific check-in invalidation when we have a proper marker for it
           */
          invalidate("invalidate:check_in");
          invalidate("invalidate:mark_as_watched:episode");
          break;
        case "movie:watched":
          /**
           * FIXME: add specific check-in invalidation when we have a proper marker for it
           */
          invalidate("invalidate:check_in");
          invalidate("invalidate:mark_as_watched:movie");
          break;
        default:
          print(LogLevel.Log, "warn", "WS Warning: Unknown key", data.key);
      }
    } catch (e) {
      print(LogLevel.Log, "error", "WS Error: Invalid JSON", e);
      return;
    }
  }

  token.subscribe(($token) => {
    socket?.removeEventListener("message", wsInvalidate);
    socket = createConnection(socket, $token?.value);
    socket?.addEventListener("message", wsInvalidate);
  });

  onDestroy(() => destroySocket(socket));
</script>
