# Always-loaded core (small, project-wide)

@.agents/rules/project.md

@.agents/rules/code-principles.md

@.agents/rules/implementation.md

@.agents/rules/testing.md

# Domain rules - load on demand

Domain-specific rules are NOT auto-imported to keep baseline context small.
Read them when the work touches the matching area. CLAUDE.md routes the
mapping; the rule files live at `.agents/rules/`:

- `components.md` - UI surface (lib/components, lib/features, lib/sections, lib/guards)
- `requests.md` - API requests, queries, mutations, mappers (lib/requests)
- `utils.md` - shared utilities (lib/utils)
- `performance.md` - perf work: animations, scroll handlers, IntersectionObservers, rxjs plumbing, bundle/boot, viewport gating

Read with the Read tool when the task enters the domain. Re-read after long
gaps if context was compacted.
