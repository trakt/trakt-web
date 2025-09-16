<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<Redirect to={UrlBuilder.show(params.slug, { season: params.season })} />
