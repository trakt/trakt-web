<script lang="ts">
  import { writable } from "$lib/utils/store/WritableSubject.ts";

  const themeColor = writable("transparent");

  function setupFrame(ev: Event) {
    const iframeElement = ev.target as HTMLIFrameElement;

    try {
      const iframeDocument = iframeElement.contentDocument;
      const iframeWindow = iframeElement.contentWindow;

      if (!iframeDocument || !iframeWindow) {
        console.error("Cannot access iframe document or window");
        return;
      }

      const scriptElement = iframeDocument.createElement("script");
      scriptElement.textContent = `
          // Set PWA simulator flag in localStorage
          sessionStorage.setItem('__trakt_pwa_simulator', 'true');

          console.log('📱 PWA Simulator activated - App will behave as if installed as PWA');
        `;

      iframeDocument.head.appendChild(scriptElement);
      iframeDocument.documentElement.setAttribute("data-mobile-os", "android");

      const themeColorMeta = iframeDocument.querySelector(
        'meta[name="theme-color"]',
      ) as HTMLMetaElement;

      function setThemeColor() {
        const color = themeColorMeta?.getAttribute("content");
        if (!color) {
          console.error("🎨 Theme color not found");

          return;
        }

        console.log("🎨 Theme color found:", color);
        themeColor.set(color);
      }

      setThemeColor();

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "content"
          ) {
            setThemeColor();
          }
        });
      });
      observer.observe(themeColorMeta, { attributes: true });

      console.log("🤖 Android mode activated");
    } catch (e) {
      console.error("Failed to inject PWA simulator into iframe:", e);
    }
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  const time = writable(formatTime(new Date()));

  setInterval(() => {
    time.set(formatTime(new Date()));
  }, 1000);
</script>

<div
  class="trakt-android-phone-container"
  style:--background-android-theme-color={$themeColor}
>
  <div class="trakt-android-phone-top-bar">
    <div class="trakt-android-phone-top-bar-left">{$time}</div>
    <div class="trakt-android-phone-top-bar-right">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
        style:scale="0.75"
      >
        <path
          d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
        style:scale="0.75"
      >
        <path d="m80-80 800-800v800H80Z" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
        style:scale="0.75"
      >
        <path
          d="M320-80q-17 0-28.5-11.5T280-120v-640q0-17 11.5-28.5T320-800h80v-80h160v80h80q17 0 28.5 11.5T680-760v640q0 17-11.5 28.5T640-80H320Z"
        />
      </svg>
    </div>
  </div>
  <div class="trakt-pwa-content">
    <iframe
      class="trakt-web-android-pwa"
      title="Trakt Web Android PWA"
      onload={setupFrame}
      src="/"
    >
    </iframe>
  </div>
  <div class="trakt-android-gesture-navbar">
    <div class="trakt-android-gesture-pill"></div>
  </div>
</div>

<style>
  * {
    transition:
      background-color var(--transition-increment) ease-in-out,
      color var(--transition-increment) ease-in-out;
  }

  .trakt-android-phone-container {
    --width-android: 390px;
    --height-android: 860px;
    --height-android-gesture: 24px;
    --width-gesture-pill: 80px;
    --height-gesture-pill: 4px;

    --width-pwa: 390px;
    --height-pwa: 800px;

    display: flex;
    position: relative;
    justify-content: center;
    height: var(--height-android);
    background-color: var(--shade-900);
    border-radius: var(--border-radius-xl);
    overflow: hidden;

    .trakt-android-phone-top-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: calc(
        var(--height-android) - var(--height-pwa) -
          var(--height-android-gesture)
      );
      background-color: var(--background-android-theme-color);
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: var(--ni-16);
      box-sizing: border-box;

      font-size: var(--font-size-text);

      .trakt-android-phone-top-bar-left {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
        text-align: left;
        flex-grow: 1;
        color: var(--background-android-theme-color);
        filter: invert(1);
      }

      .trakt-android-phone-top-bar-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--background-android-theme-color);
        filter: invert(1);

        svg {
          margin: 0 var(--ni-neg-2);
        }
      }
    }

    .trakt-pwa-content {
      margin-top: calc(
        var(--height-android) - var(--height-pwa) -
          var(--height-android-gesture)
      );
    }

    .trakt-android-gesture-navbar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: var(--height-android-gesture);
      background-color: black;
      display: flex;
      justify-content: center;

      .trakt-android-gesture-pill {
        width: var(--width-gesture-pill);
        height: var(--height-gesture-pill);
        margin-top: calc(
          calc(var(--height-android-gesture) / 2) -
            calc(var(--height-gesture-pill) / 2)
        );

        background-color: var(--shade-50);
        border-radius: var(--border-radius-l);
      }
    }
  }

  iframe {
    display: block;
    margin: 0 auto;
    width: var(--width-pwa);
    height: var(--height-pwa);
    border: none;
  }

  :global(header, footer, .trakt-mobile-navbar, .trakt-mobile-navbar-spacer) {
    display: none !important;
  }
</style>
