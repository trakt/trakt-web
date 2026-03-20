---
trigger: glob
globs: "**"
description: "General implementation approach for all source code in this project."
applyTo: "**"
---

# Implementation Guidelines

## Before Writing Code

- **Search for existing patterns first.** This codebase has conventions — follow them.
- Check how similar functionality is implemented elsewhere in the project before creating something new.
- Prefer referencing real files as examples over abstract descriptions.

## When Establishing New Patterns

- When you establish a new pattern that diverges from or extends existing conventions, note it so documentation can be updated.
- If you find yourself writing a helper used in 2+ places, consider whether it belongs in `lib/utils/`.
- If you refactor shared logic, document the new pattern.

## Naming Conventions

- **PascalCase**: Component names, interfaces, and type aliases
- **camelCase**: Variables, functions, and methods
- **ALL_CAPS**: Global constants only (not local constants)
- Components: PascalCase files (e.g., `ClampedText.svelte`, `MoreButton.svelte`)
- Utilities/helpers: camelCase files (e.g., `lineClamp.ts`, `clickOutside.ts`)
- Type definitions: PascalCase files (e.g., `MediaStoreProps.ts`, `FilterParams.ts`)

## TypeScript Standards

- Always use TypeScript with strict mode.
- No `any` types; use specific types or utility types.
- Use Zod for runtime validation and type inference. Define schema first, then derive type with `z.infer`.
- Use `Nil` type for `null | undefined`.
- Use `.nullish()` in Zod schemas for optional nullable fields.
- Use optional chaining (`?.`) and nullish coalescing (`??`).
