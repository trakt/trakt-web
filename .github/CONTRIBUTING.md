# Contributing to trakt-web

First off — **thank you** for taking the time to contribute! 🎬

Whether you're fixing a typo, squashing a bug, translating a string, or
proposing a new feature, every contribution matters and is genuinely
appreciated. PRs are always open - no need to ask first.

This document covers the basics of how things work around here.

## Bug Reports

Found something broken? Please [open an issue](../../issues/new) and describe
what you saw versus what you expected. The more detail you can share (steps to
reproduce, browser/OS, screenshots if relevant), the faster we can track it down
and fix it.

## Feature Requests

Have an idea that could make trakt-web better? Start a
[GitHub Discussion](../../discussions/new) so we can explore it together before
anyone writes code. This helps make sure the effort is well-spent and aligns
with where the project is headed.

## Pull Requests

**PRs are always welcome - please don't hesitate to open one!**

A few guidelines to keep things smooth:

- **Bug fixes** can be submitted directly as a PR at any time. No prior
  discussion needed.
- **New features or behavioral changes** should be discussed in a GitHub
  Discussion or issue first, just so we're aligned before you invest a lot of
  time.
- Keep your PR focused — one thing at a time makes review much easier.
- Don't worry about getting it perfect on the first try. We'll work through it
  together in the review.

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/), enforced by
`commitlint`. One thing that trips people up: the **scope** (the bit in
parentheses, e.g. `fix(settings):`) is not free-form - it's a fixed list. If you
pick a scope that isn't on the list, the `commitlint` check fails.

The full list lives in [`commitlint.config.js`](../commitlint.config.js) under
`scope-enum`. Pick the closest existing scope to what you touched, or open the
PR and we'll help you land on the right one - it's an easy fix.

### The red checks on your PR are probably fine 🙂

If you're contributing from a fork, you'll likely see a few checks go red:
**Enable Auto Merge**, **E2E**, and **DeepSource: Test coverage**. These need
repository secrets that GitHub - correctly - never shares with fork PRs, so they
can't pass from a fork no matter how good your change is. They're not caused by
your diff. A maintainer takes care of them when merging, so don't let them worry
you.

## i18n Contributions

Helping make trakt-web available in more languages is a fantastic way to
contribute, and no deep technical knowledge is required!

1. **Find what's missing:** Check the `client/i18n/messages` folder - each
   language has its own JSON file, and gaps are often obvious.
2. **Add or update translations:** Edit the appropriate file with accurate,
   natural-sounding translations. Context matters - aim for how a native speaker
   would say it, not a literal word-for-word translation.
3. **Open a PR:** Follow the general PR guidelines above and mention which
   language(s) you worked on.

## Code of Conduct

We're committed to keeping this a welcoming space for everyone. Please read our
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — it's simple and sensible.
