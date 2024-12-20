<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import Button from "$lib/components/buttons/Button.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<Button
  href={UrlBuilder.movies()}
  label={m.navbar_link_movies_label()}
  style="flat"
  variant="primary"
  size="small"
>
  {m.find_movies_link()}
  {#snippet icon()}
    <MovieIcon />
  {/snippet}
</Button>
