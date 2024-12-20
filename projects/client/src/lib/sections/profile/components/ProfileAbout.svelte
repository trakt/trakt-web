<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";

  const { current } = useUser();
</script>

<p class="large secondary">{current().about}</p>
