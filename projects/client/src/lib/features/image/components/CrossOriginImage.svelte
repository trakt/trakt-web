<script lang="ts">
  import { deserialize } from "$app/forms";
  import { IS_PROD } from "$lib/utils/env";
  import { writable } from "svelte/store";
  import type { SerializedImageResponse } from "../models/SerializedImageResponse";
  const emptyResponse = {
    uri: "",
  };

  type CrossOriginImageProps = {
    src: string;
    alt: string;
    onLoad?: () => void;
  };

  const { alt, src, onLoad }: CrossOriginImageProps = $props();

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

  let isImageLoaded = $state(false);
</script>

{#if $response.uri}
  <img
    class:image-loaded={isImageLoaded}
    src={$response.uri}
    {alt}
    onload={() => {
      isImageLoaded = true;
      onLoad?.();
    }}
  />
{/if}

<style>
  .image-loaded {
    opacity: 1;
  }

  img {
    transition: opacity 250ms ease-in;
    opacity: 0;
  }
</style>
