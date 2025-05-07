<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toHumanETA } from "$lib/utils/formatting/date/toHumanETA";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";

  // Svelte 5 runes
  const today = $state(new Date());

  // Create dates for nearby days (past and future)
  const nearPastDates = $derived(
    Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (i + 1));
      return date;
    }),
  );

  const nearFutureDates = $derived(
    Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + (i + 1));
      return date;
    }),
  );

  // Week markers
  const oneWeekAgo = $derived.by(() => {
    const date = new Date(today);
    date.setDate(today.getDate() - 7);
    return date;
  });

  const oneWeekLater = $derived.by(() => {
    const date = new Date(today);
    date.setDate(today.getDate() + 7);
    return date;
  });

  // Create dates for month increments (past and future)
  const pastMonthDates = $derived(
    Array.from({ length: 11 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() - (i + 1));
      return date;
    }),
  );

  const futureMonthDates = $derived(
    Array.from({ length: 11 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() + (i + 1));
      return date;
    }),
  );

  // Create a date for next year and last year
  const nextYearDate = $derived.by(() => {
    const date = new Date(today);
    date.setFullYear(today.getFullYear() + 1);
    return date;
  });

  const lastYearDate = $derived.by(() => {
    const date = new Date(today);
    date.setFullYear(today.getFullYear() - 1);
    return date;
  });

  // Create durations for demonstration with media-related scenarios
  const durations = $state([
    {
      scenario: "Movie runtime",
      days: 0,
      hours: 2,
      minutes: 15,
    },
    {
      scenario: "TV episode",
      days: 0,
      hours: 0,
      minutes: 42,
    },
    {
      scenario: "Feature-length documentary",
      days: 0,
      hours: 1,
      minutes: 30,
    },
    {
      scenario: "Short film",
      days: 0,
      hours: 0,
      minutes: 20,
    },
    {
      scenario: "Mini-series marathon",
      days: 0,
      hours: 6,
      minutes: 0,
    },
    {
      scenario: "Anime season",
      days: 0,
      hours: 5,
      minutes: 12,
    },
    {
      scenario: "Complete TV show binge",
      days: 2,
      hours: 18,
      minutes: 45,
    },
    {
      scenario: "Film trilogy",
      days: 0,
      hours: 8,
      minutes: 30,
    },
  ]);

  // Function to create label for date - simplified
  function getDateLabel(date: Date): string {
    const diffDays = Math.round(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";

    // For days within a week
    if (diffDays > 0 && diffDays <= 7) return `+${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `-${Math.abs(diffDays)} days`;

    // For week markers
    if (diffDays === 7) return "+1 week";
    if (diffDays === -7) return "-1 week";

    // For months
    const diffMonths =
      (date.getFullYear() - today.getFullYear()) * 12 +
      (date.getMonth() - today.getMonth());

    if (diffMonths !== 0) {
      if (diffMonths > 0)
        return `+${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
      return `-${Math.abs(diffMonths)} month${Math.abs(diffMonths) !== 1 ? "s" : ""}`;
    }

    // For years
    const diffYears = date.getFullYear() - today.getFullYear();
    if (diffYears !== 0) {
      if (diffYears > 0)
        return `+${diffYears} year${diffYears !== 1 ? "s" : ""}`;
      return `-${Math.abs(diffYears)} year${Math.abs(diffYears) !== 1 ? "s" : ""}`;
    }

    return date.toDateString();
  }

  // Rearrange the test dates to have past dates first, then today, then future dates
  const testDates = $derived([
    lastYearDate,
    ...pastMonthDates.reverse(),
    oneWeekAgo,
    ...nearPastDates.reverse(),
    today,
    ...nearFutureDates,
    oneWeekLater,
    ...futureMonthDates,
    nextYearDate,
  ]);

  // Function to determine if a date is today for styling
  function isToday(date: Date): boolean {
    return date.toDateString() === today.toDateString();
  }
</script>

<div class="container">
  <h1>Date Formatting Examples</h1>

  <section>
    <h2>Date Formatters</h2>
    <p>
      Comparison of different date formatters and how they display the same
      dates.
    </p>
    <table>
      <thead>
        <tr>
          <th>Input Date</th>
          <th>toHumanDate</th>
          <th>toHumanDay</th>
          <th>toHumanMonth</th>
          <th>toHumanETA</th>
        </tr>
      </thead>
      <tbody>
        {#each testDates as date}
          <tr class={isToday(date) ? "today" : ""}>
            <td>{getDateLabel(date)}</td>
            <td>{toHumanDate(today, date, getLocale())}</td>
            <td>{toHumanDay(date, getLocale())}</td>
            <td>{toHumanMonth(date, languageTag())}</td>
            <td>{toHumanETA(today, date, getLocale())}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Duration Formatting</h2>
    <p>
      Formats time durations with various display options for real-world
      scenarios.
    </p>
    <table>
      <thead>
        <tr>
          <th>Scenario</th>
          <th>Raw Duration</th>
          <th>Default</th>
          <th>Long</th>
          <th>Short</th>
          <th>Clamp at Day</th>
          <th>Clamp at Hour</th>
        </tr>
      </thead>
      <tbody>
        {#each durations as duration}
          <tr>
            <td><strong>{duration.scenario}</strong></td>
            <td>
              {duration.days ? `${duration.days}d ` : ""}
              {duration.hours ? `${duration.hours}h ` : ""}
              {duration.minutes ? `${duration.minutes}m` : ""}
            </td>
            <td>{toHumanDuration(duration, languageTag())}</td>
            <td
              >{toHumanDuration(
                { ...duration, unitDisplay: "long" },
                languageTag(),
              )}</td
            >
            <td
              >{toHumanDuration(
                { ...duration, unitDisplay: "short" },
                languageTag(),
              )}</td
            >
            <td
              >{toHumanDuration(
                { ...duration, clampAt: "day" },
                languageTag(),
              )}</td
            >
            <td
              >{toHumanDuration(
                { ...duration, clampAt: "hour" },
                languageTag(),
              )}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</div>

<style>
  .container {
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  section {
    margin-bottom: 3rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border: 1px solid var(--color-border);
  }

  th {
    background-color: var(--color-background);
    font-weight: 600;
  }

  tr:nth-child(even) {
    background-color: color-mix(
      in srgb,
      var(--color-background) 97.5%,
      var(--color-foreground)
    );
  }

  tr:nth-child(odd) {
    background-color: color-mix(
      in srgb,
      var(--color-background) 95%,
      var(--color-foreground)
    );
  }

  .today {
    font-weight: bold;
  }

  tr.today td {
    border-top: 2px solid var(--blue-600);
    border-bottom: 2px solid var(--blue-600);
    background-color: color-mix(
      in srgb,
      var(--color-background) 95%,
      var(--blue-600)
    );
  }

  tr.today td:first-child {
    border-left: 2px solid var(--blue-600);
  }

  tr.today td:last-child {
    border-right: 2px solid var(--blue-600);
  }
</style>
