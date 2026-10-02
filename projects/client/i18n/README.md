# i18n Meta Messages

Define messages once, generate for multiple platforms (web, Android, iOS).

## Quick Start

```bash
# Generate all platforms
npm run i18n:generate

# Generate specific platforms
deno run --allow-read --allow-write i18n/generator/cli.ts meta/ --platforms web,android,ios
```

## Message Format

```json
{
  "hello": "Hello World",
  "greeting": {
    "default": "Hello, {name}!",
    "variables": {
      "name": { "type": "string", "description": "User name", "required": true }
    }
  },
  "user_count": {
    "default": "You have {count} messages",
    "platforms": {
      "android": { "key": "user_message_count" },
      "ios": { "key": "userMessageCount" }
    },
    "variables": {
      "count": {
        "type": "number",
        "description": "Message count",
        "required": true
      }
    }
  }
}
```

## Commands

```bash
npm run i18n:convert          # Convert messages/ to meta/
npm run i18n:generate         # Generate all platforms
npm run test:unit -- i18n/   # Run tests
```

## Removing a message

Delete the key from `meta/en.json`, then run `deno task i18n:web` in
`projects/client`. The generator prunes the key from every locale catalog under
`messages/` (a deletion-only change), and the PR check that blocks hand-edited
translations allows it. `deno task i18n:resolve` is only for merge conflicts in
the catalogs and does not prune anything.
