<script lang="ts">
  import { getAuthContext } from "$lib/features/auth/stores/getAuthContext.ts";
  import type { InvalidateActionOptions } from "$lib/requests/models/InvalidateAction.ts";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { useImportInProgress } from "$lib/stores/useImportInProgress.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator";
  import { LogLevel, print } from "$lib/utils/console/print";
  import { debounce } from "$lib/utils/timing/debounce.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import { createConnection } from "./createConnection.ts";
  import { destroySocket } from "./destroySocket.ts";
  import type { WebSocketData } from "./WebSocketData.ts";

  const { token } = getAuthContext();
  const { invalidateAll } = useInvalidator();
  const { importInProgress } = useImportInProgress();

  let socket = $state<WebSocket | Nil>(null);

  let pendingActions = new Set<InvalidateActionOptions>();

  const flushInvalidations = debounce(() => {
    invalidateAll([...pendingActions]);
    pendingActions.clear();
  }, time.seconds(1));

  function scheduleInvalidation(action: InvalidateActionOptions) {
    pendingActions.add(action);
    flushInvalidations();
  }

  function wsInvalidate(event: MessageEvent) {
    if (importInProgress.getValue()) return;

    try {
      const data: WebSocketData = JSON.parse(event.data);

      switch (data.key) {
        case "show:watchlist":
          return scheduleInvalidation(InvalidateAction.Watchlisted("show"));
        case "movie:watchlist":
          return scheduleInvalidation(InvalidateAction.Watchlisted("movie"));
        case "episode:watched":
          /**
           * FIXME: add specific check-in invalidation when we have a proper marker for it
           */
          scheduleInvalidation(InvalidateAction.CheckIn);
          scheduleInvalidation(InvalidateAction.MarkAsWatched("episode"));
          break;
        case "movie:watched":
          /**
           * FIXME: add specific check-in invalidation when we have a proper marker for it
           */
          scheduleInvalidation(InvalidateAction.CheckIn);
          scheduleInvalidation(InvalidateAction.MarkAsWatched("movie"));
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
