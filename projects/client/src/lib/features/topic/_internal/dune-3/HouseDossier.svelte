<script lang="ts">
  import { page } from "$app/state";
  import { m } from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { userStatsQuery } from "$lib/requests/queries/users/userStatsQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";
  import { attachAll } from "../shared/attachAll.ts";
  import { houseMarkup } from "./houseMarkup.ts";
  import { injectDecoration } from "../shared/injectDecoration.ts";
  import { profileSlug } from "./profileSlug.ts";

  const slug$ = fromRune(() => profileSlug(page.url.pathname));
  const stats = useQuery(
    slug$.pipe(
      map((slug) => ({
        ...userStatsQuery({ slug: slug ?? "me" }),
        enabled: slug !== null,
      })),
    ),
  );

  const record = $derived.by(() => {
    const data = $stats.data;
    if (!data) return { hours: null, harvests: null };
    const minutes =
      data.totalMinutes || data.movies.minutes + data.episodes.minutes;
    return {
      hours: Math.round(minutes / 60),
      harvests: data.totalPlays || data.movies.plays + data.episodes.plays,
    };
  });

  const readText = (host: HTMLElement, selector: string) =>
    host.querySelector(selector)?.textContent?.trim() ?? "";

  const readPlays = (host: HTMLElement) => {
    const plays = Array.from(host.querySelectorAll(".trakt-stat"))
      .filter((stat) =>
        stat
          .querySelector(".tag.secondary")
          ?.textContent?.startsWith(m.stat_text_plays()),
      )
      .map((stat) =>
        Number(
          stat
            .querySelector(".stat-value p.bold")
            ?.textContent?.replace(/\D/g, ""),
        ),
      )
      .filter(Boolean);
    return plays.length ? Math.max(...plays) : null;
  };

  const decorate = (
    host: HTMLElement,
    harvested: { hours: number | null; harvests: number | null },
  ) => {
    const render = () =>
      houseMarkup({
        name:
          readText(host, ".profile-user-details .title") ||
          m.text_topic_dune_house_default_name(),
        seat:
          readText(host, ".user-location").split(",").at(0) ||
          m.text_topic_dune_house_default_seat(),
        hours: harvested.hours,
        harvests: harvested.harvests || readPlays(host),
      });

    const shown = { markup: render() };
    const remove = injectDecoration({
      host,
      className: "dn3-house",
      markup: shown.markup,
    });
    const plate = host.querySelector<HTMLElement>(":scope > .dn3-house");
    const observer = new MutationObserver(() => {
      const markup = render();
      if (!plate || markup === shown.markup) return;
      shown.markup = markup;
      plate.innerHTML = markup;
    });
    observer.observe(host.querySelector(".trakt-profile-details") ?? host, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      remove();
    };
  };

  $effect(() => {
    const harvested = record;
    return attachAll({
      selector: ".trakt-profile-container",
      attach: (host) => decorate(host, harvested),
    });
  });
</script>
