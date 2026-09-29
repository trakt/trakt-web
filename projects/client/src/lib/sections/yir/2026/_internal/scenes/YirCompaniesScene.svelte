<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { yirMediaUnit } from "../../../_internal/yirMediaUnit";
  import YirCountUp from "./YirCountUp.svelte";
  import YirRankBars from "./YirRankBars.svelte";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    type,
    companies,
  }: {
    id: string;
    index: number;
    type: "shows" | "movies";
    companies: ReadonlyArray<YirCompany>;
  } = $props();

  const logos = $derived(
    new Map(companies.map((company) => [String(company.id), company.imageUrl])),
  );
  const rows = $derived(
    companies.slice(0, 10).map((company) => ({
      key: String(company.id),
      name: company.name,
      value: company.count,
      detail: `${formatNumber(company.count)} ${yirMediaUnit(type, company.count)}`,
    })),
  );
</script>

<YirScene
  {id}
  {index}
  kicker={type === "shows"
    ? m.yir_section_title_networks()
    : m.yir_section_title_studios()}
  title={type === "shows"
    ? m.yir_2024_most_watched_networks()
    : m.yir_2024_most_watched_studios()}
>
  {#snippet children(isInView)}
    <div class="yir-companies" data-reveal style:--d="calc(var(--yir-beat) * 2)">
      <div class="yir-companies-count">
        <b>
          <YirCountUp
            value={companies.length}
            active={isInView}
            format={(value) => formatNumber(Math.round(value))}
          />
        </b>
        <span>
          {type === "shows"
            ? m.yir_2024_network_count()
            : m.yir_2024_studio_count()}
        </span>
      </div>

      <YirRankBars {rows} active={isInView}>
        {#snippet leading(row)}
          {@const logo = logos.get(row.key)}
          <span class="yir-company-logo" aria-hidden="true">
            {#if logo}
              <img src={logo} alt="" loading="lazy" />
            {:else}
              {row.name.at(0)}
            {/if}
          </span>
        {/snippet}
      </YirRankBars>
    </div>
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-companies {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-48);

    @include for-desktop {
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    }
  }

  .yir-companies-count {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    b {
      font-family: var(--yir-font-display);
      font-weight: 400;
      font-size: clamp(var(--ni-96), 16vw, var(--ni-200));
      line-height: 0.85;
      color: var(--color-yir-accent);
    }

    span {
      font-family: var(--yir-font-mono);
      font-size: var(--font-size-tag);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-yir-text-muted);
    }
  }

  .yir-company-logo {
    display: grid;
    place-items: center;
    width: var(--ni-48);
    height: var(--ni-32);
    padding: var(--ni-4);
    border-radius: var(--border-radius-s);
    background: var(--shade-10);
    color: var(--shade-1000);
    font-weight: 700;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
</style>
