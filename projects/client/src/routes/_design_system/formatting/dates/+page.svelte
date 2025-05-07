<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toHumanETA } from "$lib/utils/formatting/date/toHumanETA";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import {
    FormatSection,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from "../../_internal/table";

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

<div class="trakt-format-section">
  <h1>Date Formatting Examples</h1>

  <FormatSection
    title="Date Formatters"
    description="Comparison of different date formatters and how they display the same dates."
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>Input Date</TableCell>
          <TableCell header>toHumanDate</TableCell>
          <TableCell header>toHumanDay</TableCell>
          <TableCell header>toHumanMonth</TableCell>
          <TableCell header>toHumanETA</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {#each testDates as date}
          <TableRow highlight={isToday(date)}>
            <TableCell>{getDateLabel(date)}</TableCell>
            <TableCell>{toHumanDate(today, date, getLocale())}</TableCell>
            <TableCell>{toHumanDay(date, getLocale())}</TableCell>
            <TableCell>{toHumanMonth(date, languageTag())}</TableCell>
            <TableCell>{toHumanETA(today, date, getLocale())}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </FormatSection>

  <FormatSection
    title="Duration Formatting"
    description="Formats time durations with various display options for real-world scenarios."
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>Scenario</TableCell>
          <TableCell header>Raw Duration</TableCell>
          <TableCell header>Default</TableCell>
          <TableCell header>Long</TableCell>
          <TableCell header>Short</TableCell>
          <TableCell header>Clamp at Day</TableCell>
          <TableCell header>Clamp at Hour</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {#each durations as duration}
          <TableRow>
            <TableCell><strong>{duration.scenario}</strong></TableCell>
            <TableCell>
              {duration.days ? `${duration.days}d ` : ""}
              {duration.hours ? `${duration.hours}h ` : ""}
              {duration.minutes ? `${duration.minutes}m` : ""}
            </TableCell>
            <TableCell>{toHumanDuration(duration, languageTag())}</TableCell>
            <TableCell>
              {toHumanDuration(
                { ...duration, unitDisplay: "long" },
                languageTag(),
              )}
            </TableCell>
            <TableCell>
              {toHumanDuration(
                { ...duration, unitDisplay: "short" },
                languageTag(),
              )}
            </TableCell>
            <TableCell>
              {toHumanDuration({ ...duration, clampAt: "day" }, languageTag())}
            </TableCell>
            <TableCell>
              {toHumanDuration({ ...duration, clampAt: "hour" }, languageTag())}
            </TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </FormatSection>
</div>

<style>
  .trakt-format-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
