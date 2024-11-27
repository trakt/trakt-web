<script lang="ts">
  const { size = "normal" }: IconProps = $props();
</script>

{#if size === "normal"}
  <div class="check-icon-container">
    <div class="check-icon-container">
      <svg
        class="check-icon"
        width="24"
        height="18"
        viewBox="0 0 24 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="icon"
          d="M23.0417 1.19259L8.19247 16.0418L0.999879 8.84924"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>

      <svg
        width="26"
        height="21"
        class="check-icon-active"
        viewBox="0 0 26 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.0814 8.08148L21.506 0.65686L22.9202 2.07107L15.4956 9.4957L8.77805 16.2132L11.6065 19.0416L10.1923 20.4559L6.65673 16.9203L0.29277 10.5564L1.70698 9.14214L7.36384 14.799L14.0814 8.08148ZM4.53572 6.31438L8.77836 10.557L7.36414 11.9712L3.1215 7.7286L4.53572 6.31438ZM24.3344 3.48431L11.6065 16.2122L13.0207 17.6264L25.7486 4.89852L24.3344 3.48431Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
{/if}

{#if size === "small"}
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 3L6.42105 13L2 8.51315" stroke="#913CB4" stroke-width="3" />
  </svg>
{/if}

<style>
  .check-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .check-icon-active {
    position: absolute;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .check-icon {
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
  }

  :global(button):active {
    .check-icon {
      opacity: 0;
    }

    .check-icon-active {
      opacity: 1;
    }
  }
</style>
