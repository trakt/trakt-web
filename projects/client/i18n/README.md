# i18n Meta Messages

Define messages once, generate for multiple platforms (web, Android, iOS).

## Quick Start

```bash
# Convert existing Inlang messages to meta format
npm run i18n:convert

# Generate platform-specific files
npm run i18n:generate
```

## Message Format

### Simple

```json
"hello": "Hello World"
```

### With Variables

```json
"greeting": {
  "default": "Hello, {name}!",
  "variables": {
    "name": { "type": "string", "description": "User name", "required": true }
  }
}
```

### Platform-Specific Keys

```json
"user_count": {
  "default": "You have {count} messages",
  "platforms": {
    "android": { "key": "user_message_count" },
    "ios": { "key": "userMessageCount" }
  },
  "variables": {
    "count": { "type": "number", "description": "Message count", "required": true }
  }
}
```

## Commands

```bash
# Convert messages/ to meta/
npm run i18n:convert

# Generate all platforms
npm run i18n:generate

# Generate single file
npm run i18n:generate:single meta/en.json

# Run tests
npm run test:unit -- i18n/
```

## Output

- **Web**: `{name}` → `{name}`
- **Android**: `{name}` → `%s`, `{count}` → `%d`
- **iOS**: `{name}` → `%@`, `{count}` → `%d` (String Catalog format)

Files generated in `.output/generated/`:

- `messages/en.json` (Inlang)
- `android/values-en/strings.xml`
- `ios/Localizable.xcstrings` (iOS String Catalog)
