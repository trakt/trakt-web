<script lang="ts">
  import { onMount } from "svelte";

  type PropertyTag = { property: string };
  type NameTag = { name: string };

  type UniqueMetaTagProps = {
    content: string;
  } & (PropertyTag | NameTag);

  const props: UniqueMetaTagProps = $props();

  const attribute =
    "property" in props
      ? { name: "property", value: props.property }
      : { name: "name", value: props.name };

  const selector = `meta[${attribute.name}="${attribute.value}"]`;

  const removeTag = () => document.querySelector(selector)?.remove();

  /*
    We manually make Svelte render meta tags in a reactive way since
    Svelte does not update initial tags: https://github.com/sveltejs/svelte/issues/5668
  */
  $effect(() => {
    removeTag();

    const meta = document.createElement("meta");
    meta.setAttribute(attribute.name, attribute.value);
    meta.setAttribute("content", props.content);
    document.head.appendChild(meta);
  });

  onMount(() => {
    return () => removeTag();
  });
</script>
