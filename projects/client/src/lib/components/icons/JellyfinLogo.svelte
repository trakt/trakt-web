<script lang="ts">
  const gradientId = $props.id();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 512 512"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient
      id={gradientId}
      x1="110.25"
      y1="213.3"
      x2="496.14"
      y2="436.09"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#aa5cc3" />
      <stop offset="1" stop-color="#00a4dc" />
    </linearGradient>
  </defs>
  <path
    d="M256 201.62c-20.44 0-86.23 119.29-76.2 139.43s142.48 19.92 152.4 0-55.73-139.42-76.2-139.43z"
    fill="url(#{gradientId})"
  />
  <path
    d="M256 23.3c-61.56 0-259.82 359.44-229.59 420.13s429.34 60 459.24 0S317.62 23.3 256 23.3zm150.73 367.46c-19.59 39.33-281.08 39.77-300.9 0S215.69 112.18 256 112.18s170.32 239.25 150.73 278.58z"
    fill="url(#{gradientId})"
  />
</svg>
