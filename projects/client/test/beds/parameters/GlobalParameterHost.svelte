<script lang="ts">
  import { appendGlobalParameters } from "$lib/features/parameters/appendGlobalParameters";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import GlobalParameterProvider from "$lib/features/parameters/GlobalParameterProvider.svelte";
  import GlobalParameterSetter from "$lib/features/parameters/GlobalParameterSetter.svelte";

  type GlobalParameterHostProps = {
    href: string;
    parameter: string;
    escaped?: boolean;
  };

  const { href, parameter, escaped = false }: GlobalParameterHostProps =
    $props();
</script>

<GlobalParameterProvider>
  <GlobalParameterEscaper enabled={escaped}>
    <GlobalParameterSetter {parameter}>
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
      <a data-testid="link" use:appendGlobalParameters={href} {href}>link</a>
    </GlobalParameterSetter>
  </GlobalParameterEscaper>
</GlobalParameterProvider>
