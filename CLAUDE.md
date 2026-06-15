Before implementing anything, identify which domain you are working in and
read the corresponding rule file from `.agents/rules/` (only the core rules
auto-load via AGENTS.md; domain rules load on demand):

- UI surface (lib/components, lib/features, lib/sections, lib/guards): read
  components.md
- API requests, queries, mutations, mappers (lib/requests): read requests.md
- Shared utilities (lib/utils): read utils.md
- Perf work (animations, scroll handlers, IntersectionObservers, rxjs
  plumbing, bundle/boot, viewport gating): read performance.md
- Tests (`*.test.ts`, `*.spec.ts`, files under `test/`): testing.md (already
  loaded as core)
- All other source code: project.md, code-principles.md, implementation.md
  (always-on baseline, already loaded as core).

@AGENTS.md
