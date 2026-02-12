<script>
  import ActiveContent from "../_internal/ActiveContent.svelte";
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
      d="M6 21H1V19H6V21ZM23 21H9V19H23V21ZM6.70703 10.707L3 14.4141L0.292969 11.707L1.70703 10.293L3 11.5859L5.29297 9.29297L6.70703 10.707ZM21 13H9V11H21V13ZM6 5H1V3H6V5ZM23 5H9V3H23V5Z"
      fill="currentColor"
    />

    {#snippet active()}
      <path
        d="M6.70703 18.707L3 22.4141L0.292969 19.707L1.70703 18.293L3 19.5859L5.29297 17.293L6.70703 18.707ZM23 21H9V19H23V21ZM6 13H1V11H6V13ZM21 13H9V11H21V13ZM6.70703 2.70703L3 6.41406L0.292969 3.70703L1.70703 2.29297L3 3.58594L5.29297 1.29297L6.70703 2.70703ZM23 5H9V3H23V5Z"
        fill="currentColor"
      />
    {/snippet}
  </ActiveContent>
</svg>
