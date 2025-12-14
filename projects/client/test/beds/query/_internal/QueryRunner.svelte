<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { map, type Observable } from "rxjs";

  const {
    factory,
    output,
    mapper = (response) => response,
    waitFor = (response) => !!response,
  }: {
    factory: () => Observable<unknown>;
    output: (value: unknown) => void;
    mapper?: (response: unknown) => unknown;
    waitFor?: (response: unknown) => boolean;
  } = $props();

  iffy(() =>
    factory()
      .pipe(map(mapper))
      .subscribe((result) => {
        if (!waitFor(result)) {
          return;
        }

        output(result);
      }),
  );
</script>
