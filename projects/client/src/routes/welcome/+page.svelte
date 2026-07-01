<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<Redirect to={UrlBuilder.home()} />
