<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import type { CirclePackChartOptions } from "@carbon/charts";
  import { CirclePackChart } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";

  const {
    companies,
    type = "shows",
  }: {
    companies: YirCompany[];
    type?: "shows" | "movies";
  } = $props();

  let chartContainer: HTMLDivElement;

  // Transform data to CirclePack format - hierarchical structure required
  const chartData = $derived([
    {
      name: "root",
      children: companies.map((company) => ({
        name: company.name,
        value: company.count,
      })),
    },
  ]);

  const colorByName = $derived(
    Object.fromEntries(
      companies.map((c) => {
        const raw = (c.color ?? "").toLowerCase();
        const isBlackish = raw === "#000" || raw === "#000000";
        const color = !raw || isBlackish ? "#333" : c.color;
        return [c.name, color];
      }),
    ),
  );

  const options = $derived<CirclePackChartOptions>({
    title: "",
    theme: "g100",
    height: "600px",
    animations: false,
    legend: {
      enabled: false,
    },
    toolbar: {
      enabled: false,
    },
    canvasZoom: {
      enabled: false,
    },
    getFillColor: (_group, label, data, defaultFillColor) => {
      const name: string = label ?? data?.name ?? data?.key ?? "";
      return colorByName[name] ?? defaultFillColor ?? "#333";
    },
    circlePack: {
      depth: 1, // Only show children, not root
      padding: {
        outer: 3,
        inner: 3,
      },
    },
    tooltip: {
      customHTML: (data: any) => {
        if (!data || data.length === 0) return "";
        const point = data[0];

        // Handle different possible data structures
        const name = point.name || point.label || point.key || "Unknown";
        const count = point.value || point.data?.value || 0;

        const itemLabel = type === "movies"
          ? (count === 1 ? "movie" : "movies")
          : (count === 1 ? "show" : "shows");

        return `
          <div class="yir-chart-tooltip">
            <div class="yir-chart-tooltip-name">${name}</div>
            <div class="yir-chart-tooltip-plays">${count} ${itemLabel}</div>
          </div>
        `;
      },
    },
  });

  // Add logos and text after chart renders
  $effect(() => {
    if (!chartContainer) return;

    const addLogosAndText = () => {
      const svg = chartContainer.querySelector("svg");
      if (!svg) return false;

      // Add white image filter if not already present
      if (!svg.querySelector("#whiteimage")) {
        const defs = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "defs",
        );
        const filter = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "filter",
        );
        filter.setAttribute("id", "whiteimage");

        const colorMatrix = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feColorMatrix",
        );
        colorMatrix.setAttribute("in", "SourceGraphic");
        colorMatrix.setAttribute("type", "matrix");
        // Force all RGB to white (1) while preserving alpha
        colorMatrix.setAttribute(
          "values",
          "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0",
        );

        filter.appendChild(colorMatrix);
        defs.appendChild(filter);
        svg.insertBefore(defs, svg.firstChild);
      }

      // With depth: 1, circles should be in same order as companies
      const allCircles = Array.from(svg.querySelectorAll("circle"));
      if (allCircles.length === 0) return false;

      companies.forEach((company, index) => {
        const circle = allCircles[index];
        if (!circle) {
          console.warn(`No circle for ${company.name} at index ${index}`);
          return;
        }

        const cx = parseFloat(circle.getAttribute("cx") || "0");
        const cy = parseFloat(circle.getAttribute("cy") || "0");
        const r = parseFloat(circle.getAttribute("r") || "0");

        // Skip very small circles
        if (r < 20) return;

        // Check if we already added content
        const existingGroup = circle.parentElement?.querySelector(
          `[data-company-id="${company.id}"]`,
        );
        if (existingGroup) return;

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("data-company-id", String(company.id));
        g.setAttribute("pointer-events", "none");

        if (company.imageUrl) {
          // Add logo image
          const image = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image",
          );
          const imageSize = Math.min(r * 1.2, 80);

          // Use both href and xlink:href for better browser compatibility
          image.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            company.imageUrl,
          );
          image.setAttribute("href", company.imageUrl);
          image.setAttribute("x", String(cx - imageSize / 2));
          image.setAttribute("y", String(cy - imageSize / 2));
          image.setAttribute("width", String(imageSize));
          image.setAttribute("height", String(imageSize));
          image.setAttribute("preserveAspectRatio", "xMidYMid meet");
          image.setAttribute("filter", "url(#whiteimage)");

          // Add error handler - fallback to text if image fails to load
          image.addEventListener("error", () => {
            g.innerHTML = ""; // Clear the image

            // Add text fallback
            const text = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "text",
            );
            text.setAttribute("x", String(cx));
            text.setAttribute("y", String(cy));
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("fill", "#fff");
            text.setAttribute("font-size", String(Math.max(12, r / 4)));
            text.setAttribute("font-weight", "600");

            const maxChars = Math.floor(r / 5);
            const displayName =
              company.name.length > maxChars
                ? company.name.substring(0, maxChars) + "..."
                : company.name;
            text.textContent = displayName;
            g.appendChild(text);
          });

          g.appendChild(image);
        } else {
          // Add text fallback
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text",
          );
          text.setAttribute("x", String(cx));
          text.setAttribute("y", String(cy));
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "middle");
          text.setAttribute("fill", "#fff");
          text.setAttribute("font-size", String(Math.max(12, r / 4)));
          text.setAttribute("font-weight", "600");

          // Truncate long names
          const maxChars = Math.floor(r / 5);
          const displayName =
            company.name.length > maxChars
              ? company.name.substring(0, maxChars) + "..."
              : company.name;
          text.textContent = displayName;
          g.appendChild(text);
        }

        circle.parentElement?.appendChild(g);
      });

      return true;
    };

    const rebuildLogos = () => {
      // Remove old logo groups so they get re-created at the new circle positions
      chartContainer
        ?.querySelectorAll("[data-company-id]")
        .forEach((el) => el.remove());
      addLogosAndText();
    };

    // Initial render with retry logic
    let retryCount = 0;
    const maxRetries = 10;
    const tryAddLogos = () => {
      const success = addLogosAndText();
      if (!success && retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryAddLogos, 200);
      }
    };

    setTimeout(tryAddLogos, 100);

    // Watch for chart updates (Carbon rebuilds the SVG on data / theme changes)
    const observer = new MutationObserver(addLogosAndText);
    observer.observe(chartContainer, { childList: true, subtree: true });

    // Watch for container size changes — Carbon re-lays out circles, so
    // we need to re-position the overlaid logos to match.
    let resizeFrame: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      // Defer so Carbon can finish its own layout pass first.
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        rebuildLogos();
      });
    });
    resizeObserver.observe(chartContainer);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
    };
  });
</script>

<div class="yir-networks-chart" bind:this={chartContainer}>
  <CirclePackChart data={chartData} {options} />
</div>

<style lang="scss">
  .yir-networks-chart {
    width: 100%;
    height: var(--ni-640);

    :global(.cds--cc--chart-wrapper),
    :global(.cds--cc--chart-svg),
    :global(.cds--cc--chart-holder),
    :global(svg) {
      background: transparent;
    }

    // Style the circle pack nodes
    :global(circle) {
      stroke: none;
      cursor: pointer;
      opacity: 1;
      fill-opacity: 1;
      transition: transform 0.2s ease;
      transform-box: fill-box;
      transform-origin: center;

      &:hover {
        transform: scale(1.05);
      }
    }

    // Hide default labels from Carbon Charts
    :global(text) {
      display: none;
    }

    // Show our custom text labels
    :global([data-company-id] text) {
      display: block;
    }
  }

  // Carbon Charts tooltip overrides
  // These are global because Carbon Charts portals the tooltip out of the component's DOM tree.
  :global(.cds--tooltip),
  :global(.cds--cc--tooltip),
  :global(.cds--cc--tooltip-container) {
    background: transparent;
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  :global(.cds--cc--tooltip .content-box .title-tooltip) {
    max-width: none;
  }

  :global(.cds--cc--tooltip),
  :global(.cds--cc--tooltip *) {
    max-width: none;
    overflow: visible;
    text-overflow: clip;
  }

  :global(.yir-chart-tooltip) {
    background: color-mix(in srgb, var(--shade-1000) 92%, transparent);
    border: var(--border-thickness-xxs) solid var(--shade-800);
    border-radius: var(--border-radius-xs);
    padding: var(--ni-8) var(--ni-12);
    color: var(--shade-10);
    font-family: inherit;
    box-shadow: 0 var(--ni-2) var(--ni-8)
      color-mix(in srgb, var(--shade-1000) 60%, transparent);
    text-align: center;
  }

  :global(.yir-chart-tooltip-name) {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: var(--ni-4);
    color: var(--shade-10);
    white-space: nowrap;
  }

  :global(.yir-chart-tooltip-plays) {
    font-size: 11px;
    opacity: 0.85;
  }
</style>
