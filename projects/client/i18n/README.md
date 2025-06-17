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
