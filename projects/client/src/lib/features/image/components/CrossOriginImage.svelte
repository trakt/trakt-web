<script lang="ts">
  import { deserialize } from "$app/forms";
  import { writable } from "svelte/store";
  import { IS_PROD } from "$lib/utils/env";
  import type { SerializedImageResponse } from "../models/SerializedImageResponse";
  const emptyResponse = {
    uri: "https://dummyimage.com/400/333333/efefef.png&text=.",
  };

  type CrossOriginImageProps = {
    src: string;
    alt: string;
  };

  const { alt, src }: CrossOriginImageProps = $props();

  function urlContentToDataUri(url: string) {
    if (IS_PROD) {
      return Promise.resolve({
        uri: url,
      });
    }

    const body = new FormData();
    body.append("url", url);

    return fetch("/image/?/resolve", {
      method: "POST",
      headers: {
        "x-sveltekit-action": "true",
      },
      body: body,
    }).then(async (res) => {
      const text = await res.text();
      const deserialized = deserialize<SerializedImageResponse, undefined>(
        text,
      );

      if (deserialized?.type === "success") {
        return deserialized.data ?? emptyResponse;
      }

      return emptyResponse;
    });
  }

  const response = writable(emptyResponse);

  $effect(() => {
    if (!src) {
      return;
    }

    urlContentToDataUri(src).then(response.set);
  });
</script>

<img src={$response.uri} {alt} />
