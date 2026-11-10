<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import LaurelIcon from "$lib/components/icons/LaurelIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { AwardEntry } from "$lib/requests/models/AwardEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import AwardTag from "./AwardTag.svelte";
  import { toAwardCategoryName } from "./toAwardCategoryName.ts";
  import { toAwardName } from "./toAwardName.ts";

  const { entry }: { entry: AwardEntry } = $props();

  const award = $derived(
    toAwardName({ ceremony: entry.ceremony.key, count: 1 }),
  );
  const awards = $derived(
    toAwardName({ ceremony: entry.ceremony.key, count: 2 }),
  );
  const category = $derived(toAwardCategoryName(entry.category));
  const subtitle = $derived(
    entry.person
      ? [category, award].join(" · ")
      : [award, entry.year].join(" · "),
  );
</script>

{#snippet tag()}
  <AwardTag won={entry.won} />
{/snippet}

<div class="trakt-award-card">
  <PersonCard>
    {#if entry.person}
      <Link focusable={false} href={UrlBuilder.people(entry.person.slug)}>
        <CardCover
          title={entry.person.name}
          src={entry.person.headshot.url.thumb}
          alt={m.image_alt_person_headshot({ person: entry.person.name })}
          {tag}
        />
      </Link>
    {:else}
      <div
        class="award-laurel-cover"
        data-state={entry.won ? "won" : "nominee"}
      >
        <LaurelIcon />
        <span class="tag secondary uppercase">{awards} {entry.year}</span>
        <div class="award-laurel-tag">
          {@render tag()}
        </div>
      </div>
    {/if}
    <CardFooter align="start">
      <p
        class="trakt-card-title ellipsis"
        title={entry.person?.name ?? category}
      >
        {entry.person?.name ?? category}
      </p>
      <p
        class="trakt-card-subtitle"
        title={subtitle}
        use:lineClamp={{ lines: 2 }}
      >
        {subtitle}
      </p>
    </CardFooter>
  </PersonCard>
</div>

<style lang="scss">
  .trakt-award-card {
    display: flex;
    flex: none;

    --height-override-card: calc(var(--height-person-card) + var(--ni-14));

    --color-background-stem-tag: var(--color-background-cover-tag);
    --shadow-stem-tag: var(--shadow-cover-tag);
  }

  .award-laurel-cover {
    position: relative;
    box-sizing: border-box;

    display: grid;
    place-items: center;
    align-content: center;
    gap: var(--ni-6);

    height: var(--height-override-card-cover, var(--height-card-cover));
    border-radius: var(--border-radius-m);
    background:
      radial-gradient(
        90% 70% at 50% 40%,
        var(--color-award-gold-soft),
        transparent 70%
      ),
      var(--color-card-background);

    > :global(svg) {
      width: var(--ni-52);
      height: var(--ni-52);
      color: var(--color-award-gold);
    }

    .tag {
      letter-spacing: 0.08em;
    }

    &[data-state="nominee"] {
      background: var(--color-card-background);

      > :global(svg) {
        color: var(--color-award-nominee);
      }
    }

    .award-laurel-tag {
      position: absolute;
      inset-block-end: var(--ni-8);
      inset-inline: 0;

      display: flex;
      justify-content: center;
    }
  }
</style>
