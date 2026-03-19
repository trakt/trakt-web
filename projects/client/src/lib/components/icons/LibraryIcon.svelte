<script>
  import ActiveContent from "./_internal/ActiveContent.svelte";
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <ActiveContent>
    <path
      d="M3 21H20V23H1V4H3V21ZM23 19H5V1H23V19ZM7 17H21V3H7V17ZM11.5146 6.14258L16.5146 9.14258L17.9434 10L16.5146 10.8574L11.5146 13.8574L10 14.7666V5.2334L11.5146 6.14258ZM12 11.2334L14.0557 10L12 8.7666V11.2334Z"
      fill="currentColor"
    />

    {#snippet active()}
      <path
        d="M3 21H20V23H1V4H3V21ZM23 19H5V1H23V19ZM7 17H21V3H7V17ZM10 5.2334V14.7666L11.5146 13.8574L16.5146 10.8574L17.9434 10L16.5146 9.14258L11.5146 6.14258L10 5.2334Z"
        fill="currentColor"
      />
    {/snippet}
  </ActiveContent>
</svg>
