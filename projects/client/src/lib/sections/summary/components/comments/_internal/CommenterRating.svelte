<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import UserRating from "$lib/sections/components/UserRating.svelte";

  const { comment }: { comment: MediaComment } = $props();

  const { user } = useUser();
  const isOwnComment = $derived(comment.user.id === $user.id);

  const rating = $derived(comment.user.stats.rating);
</script>

{#if !isOwnComment && rating}
  <UserRating {rating} />
{/if}
