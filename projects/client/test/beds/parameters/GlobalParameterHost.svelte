<script lang="ts">
  import { appendGlobalParameters } from "$lib/features/parameters/appendGlobalParameters";
  import GlobalParameterProvider from "$lib/features/parameters/GlobalParameterProvider.svelte";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";

  type GlobalParameterHostProps = {
    href: string;
    parameter: string;
  };

  const { href, parameter }: GlobalParameterHostProps = $props();
</script>

<GlobalParameterProvider>
  <GlobalParameterSetter {parameter}>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a data-testid="link" use:appendGlobalParameters={href} {href}>link</a>
  </GlobalParameterSetter>
</GlobalParameterProvider>
