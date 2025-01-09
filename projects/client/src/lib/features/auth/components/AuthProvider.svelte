<script lang="ts">
  import { provisionAuth } from "../stores/useAuth";

  type AuthProviderProps = {
    url: string;
    isAuthorized: boolean;
  } & ChildrenProps;

  const { isAuthorized, url, children }: AuthProviderProps = $props();
  provisionAuth({
    isAuthorized,
    url,
  });
</script>

{@render children()}
