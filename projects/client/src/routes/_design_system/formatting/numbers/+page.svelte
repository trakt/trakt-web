<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";
  import {
    FormatSection,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from "../../_internal/table";

  // Svelte 5 runes
  const numbers = $state([
    { value: 0, description: "Zero" },
    { value: 42, description: "Small number" },
    { value: 999, description: "Just under thousand" },
    { value: 1000, description: "One thousand" },
    { value: 1234, description: "Four digits" },
    { value: 12345, description: "Five digits" },
    { value: 123456, description: "Six digits" },
    { value: 1234567, description: "Seven digits" },
    { value: 12345678, description: "Eight digits" },
    { value: 123456789, description: "Nine digits" },
    { value: 1234567890, description: "Ten digits" },
    { value: 1234567890123, description: "Trillions" },
  ]);

  const percentages = $state([
    { value: 0, description: "0%" },
    { value: 0.111111, description: "Repeating decimals" },
    { value: 0.25, description: "Quarter" },
    { value: 0.33, description: "One third" },
    { value: 0.5, description: "Half" },
    { value: 0.66, description: "Two thirds" },
    { value: 0.75, description: "Three quarters" },
    { value: 0.95, description: "Almost complete" },
    { value: 0.999, description: "Very close to 100%" },
    { value: 1, description: "100%" },
    { value: 1.5, description: "Over 100%" },
    { value: 2.25, description: "Over 200%" },
    { value: 0.123456789, description: "Many decimal places" },
  ]);
</script>

<div class="trakt-format-section">
  <h1>Number Formatting Examples</h1>

  <FormatSection
    title="Human-Readable Numbers"
    description="Formats numbers into compact, human-readable representations using the <code>toHumanNumber</code> utility."
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>Description</TableCell>
          <TableCell header>Raw Value</TableCell>
          <TableCell header>Formatted Output</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {#each numbers as num}
          <TableRow>
            <TableCell>{num.description}</TableCell>
            <TableCell>{num.value.toLocaleString()}</TableCell>
            <TableCell>{toHumanNumber(num.value, getLocale())}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </FormatSection>

  <FormatSection
    title="Percentage Formatting"
    description="Converts decimal values to percentage strings using the <code>toPercentage</code> utility."
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>Description</TableCell>
          <TableCell header>Decimal Value</TableCell>
          <TableCell header>Percentage</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {#each percentages as pct}
          <TableRow>
            <TableCell>{pct.description}</TableCell>
            <TableCell>{pct.value}</TableCell>
            <TableCell>{toPercentage(pct.value, getLocale())}</TableCell>
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
