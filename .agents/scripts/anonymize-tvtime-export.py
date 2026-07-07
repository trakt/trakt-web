#!/usr/bin/env python3
"""Turn a real TV Time export file into an anonymized, compact test fixture.

Keeps the real column/field SHAPE and public catalog ids (tvdb/imdb, titles,
season/episode, is_watched, status, watched_at). Scrubs user identifiers
(user_id, uuid, gsi, most_recent_ep_watched) and samples a representative
subset of rows so the fixture stays small but exercises every parser branch.
"""
import csv, io, json, sys

SCRUB_BLANK = {"gsi", "most_recent_ep_watched", "followed_at"}
SYNTH_UUID = "00000000-0000-0000-0000-{:012d}"


def scrub_csv_row(row, i):
    out = dict(row)
    if "user_id" in out:
        out["user_id"] = "0"
    for c in ("uuid", "series_uuid"):
        if c in out and out[c]:
            out[c] = SYNTH_UUID.format(i)
    for c in SCRUB_BLANK:
        if c in out:
            out[c] = ""
    return out


def anon_v2(text):
    rows = list(csv.DictReader(io.StringIO(text)))
    header = rows[0].keys() if rows else []
    we = [r for r in rows if str(r.get("key", "")).startswith("watch-episode-")]
    us = [r for r in rows if str(r.get("key", "")).startswith("user-series-")]
    stats = [r for r in rows if r.get("key") == "tracking-stats"]
    # variety: distinct shows for episodes, and each user-series flag combo
    seen_shows, ep_sample = set(), []
    for r in we:
        if r.get("s_id") not in seen_shows:
            seen_shows.add(r.get("s_id"))
            ep_sample.append(r)
        if len(ep_sample) >= 8:
            break

    def us_pick(pred):
        return next((r for r in us if pred(r)), None)

    us_sample = [r for r in [
        us_pick(lambda r: r.get("is_for_later") == "true"),
        us_pick(lambda r: r.get("is_followed") == "true" and r.get("is_for_later") != "true"),
        us_pick(lambda r: r.get("is_archived") == "true"),
    ] if r]
    sample = stats[:1] + ep_sample + us_sample
    out = io.StringIO()
    w = csv.DictWriter(out, fieldnames=list(header))
    w.writeheader()
    for i, r in enumerate(sample):
        w.writerow(scrub_csv_row(r, i))
    return out.getvalue().strip() + "\n"


def anon_export_csv(text, kind):
    rows = list(csv.DictReader(io.StringIO(text)))
    header = list(rows[0].keys()) if rows else []
    if kind == "episodes":
        seen, sample = set(), []
        for r in rows:
            key = (r.get("series_tvdb_id"), r.get("is_watched"))
            if key not in seen:
                seen.add(key)
                sample.append(r)
            if len(sample) >= 10:
                break
    elif kind == "series":
        # one row per distinct status
        by_status = {}
        for r in rows:
            by_status.setdefault(r.get("status"), r)
        sample = list(by_status.values())
    else:  # movies
        watched = [r for r in rows if r.get("is_watched") == "true"][:4]
        unwatched = [r for r in rows if r.get("is_watched") != "true"][:1]
        sample = watched + unwatched
    out = io.StringIO()
    w = csv.DictWriter(out, fieldnames=header)
    w.writeheader()
    for i, r in enumerate(sample):
        w.writerow(scrub_csv_row(r, i))
    return out.getvalue().strip() + "\n"


def anon_json_series(data):
    out = []
    for show in data[:2]:
        eps = []
        for s in (show.get("seasons") or [])[:2]:
            for e in (s.get("episodes") or [])[:3]:
                eps.append({
                    "id": {"tvdb": e.get("id", {}).get("tvdb"), "imdb": e.get("id", {}).get("imdb")},
                    "number": e.get("number"),
                    "is_watched": e.get("is_watched"),
                    "watched_at": e.get("watched_at"),
                })
            if eps:
                break
        out.append({
            "id": {"tvdb": show.get("id", {}).get("tvdb"), "imdb": show.get("id", {}).get("imdb")},
            "title": show.get("title"),
            "status": show.get("status"),
            "seasons": [{"number": (show.get("seasons") or [{}])[0].get("number", 1), "episodes": eps}],
        })
    return json.dumps(out, ensure_ascii=False, indent=1)


def anon_json_movies(data):
    watched = [m for m in data if m.get("is_watched")][:3]
    out = [{
        "id": {"tvdb": m.get("id", {}).get("tvdb"), "imdb": m.get("id", {}).get("imdb")},
        "title": m.get("title"),
        "year": m.get("year"),
        "is_watched": m.get("is_watched"),
        "watched_at": m.get("watched_at"),
    } for m in watched]
    return json.dumps(out, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    mode, src, dst = sys.argv[1], sys.argv[2], sys.argv[3]
    text = open(src, encoding="utf-8", errors="replace").read()
    if mode == "v2":
        res = anon_v2(text)
    elif mode.startswith("export-"):
        res = anon_export_csv(text, mode.split("-", 1)[1])
    elif mode == "json-series":
        res = anon_json_series(json.loads(text))
    elif mode == "json-movies":
        res = anon_json_movies(json.loads(text))
    else:
        raise SystemExit(f"unknown mode {mode}")
    open(dst, "w", encoding="utf-8").write(res)
    print(f"wrote {dst} ({len(res)} bytes)")
