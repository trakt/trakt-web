<script lang="ts">
  const { active = false }: { active?: boolean } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  height="40px"
  viewBox="0 -960 960 960"
  width="40px"
  fill="currentColor"
  class:is-active={active}
>
  <path
    class="content-inactive"
    d="M280-146.67v-467q0-27.71 19.67-47.02Q319.33-680 347-680h466.33q27.5 0 47.09 19.58Q880-640.83 880-613.33V-280L680-80H346.67q-27.5 0-47.09-19.58Q280-119.17 280-146.67ZM81-720q-5.33-27.67 10.67-49.5t43.66-27.17l460-81.66q27.67-5.34 49.5 10.33 21.84 15.67 27.17 43.33l14 78h-67.33l-11.67-66-459.67 81 66 375.34V-208q-18.66-4.33-32.5-18-13.83-13.67-17.5-34L81-720Zm265.67 106.67v466.66h298.66v-168h168v-298.66H346.67ZM580-380Z"
  />
  <path
    class="content-active"
    d="M280-146.67v-467q0-27.71 19.67-47.02Q319.33-680 347-680h466.33q27.5 0 47.09 19.58Q880-640.83 880-613.33V-280L680-80H346.67q-27.5 0-47.09-19.58Q280-119.17 280-146.67ZM81-720q-5.33-27.67 10.67-49.5t43.66-27.17l460-81.66q27.67-5.34 49.5 10.33 21.84 15.67 27.17 43.33l14 78h-67.33l-11.67-66-459.67 81 66 375.34V-208q-18.66-4.33-32.5-18-13.83-13.67-17.5-34L81-720Z"
  />
</svg>

<style>
  .content-inactive {
    opacity: 1;
  }
  .content-active {
    opacity: 0;
  }

  .content-active,
  .content-inactive {
    transition: opacity var(--transition-increment) ease-in-out;
  }

  .is-active {
    .content-active {
      opacity: 1;
    }
    .content-inactive {
      opacity: 0;
    }
  }
</style>
