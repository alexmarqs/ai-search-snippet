# AGENTS.md - Agentic Coding Guide

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

**ai-search-snippet** is a zero-dependency TypeScript Web Component library providing search and chat interfaces with streaming support. Components use Shadow DOM encapsulation and are framework-agnostic.

## Commands

### Development
```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run preview          # Preview production build
```

### Build
```bash
npm run build            # Build both demo app and library
npm run build:lib        # Build library only (outputs to dist/)
npm run build:app        # Build demo app for Cloudflare Workers
```

### Code Quality
```bash
npm run lint             # Run Biome linter
npm run lint:fix         # Auto-fix lint issues
npm run format           # Format code with Biome
npm run format:check     # Check formatting without changes
npm run check            # Full Biome check with auto-fix (recommended)
npx tsc --noEmit         # Type check without emitting files
```

### Testing
```bash
npx vitest               # Run all tests
npx vitest run           # Run tests once (CI mode)
npx vitest <pattern>     # Run tests matching pattern
npx vitest src/utils     # Run tests in specific directory
npx vitest -t "test name"  # Run single test by name
```

### Deployment
```bash
npx wrangler deploy      # Deploy to Cloudflare Workers (requires auth)
```

## Code Style

### Formatting (Biome)
- **Indent:** 2 spaces
- **Quotes:** Single quotes (`'string'`)
- **Semicolons:** Always required
- **Trailing commas:** ES5 style (in objects/arrays, not function params)
- **Line width:** 100 characters max

### TypeScript
- **Target:** ES2022
- **Strict mode:** Enabled (all strict flags)
- **No unused variables:** Enforced (`noUnusedLocals`, `noUnusedParameters`)
- **Use `satisfies`:** For type validation without widening
- **Use `import type`:** For type-only imports (enforced by `verbatimModuleSyntax`)

### Import Organization
1. Type imports first (using `import type`)
2. External dependencies (none in this project)
3. Internal modules by path depth (deepest last)
4. Always include `.ts` extension in imports

```typescript
// Correct import style
import type { SearchResult, SearchOptions } from '../types/index.ts';
import { baseStyles } from '../styles/theme.ts';
import { escapeHTML, createCustomEvent } from '../utils/index.ts';
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `SearchBarSnippet` |
| Interfaces/Types | PascalCase | `SearchResult` |
| Functions/Methods | camelCase | `performSearch()` |
| Variables | camelCase | `resultsContainer` |
| Constants | UPPER_SNAKE_CASE | `COMPONENT_NAME` |
| HTML attributes | kebab-case | `api-url`, `max-results` |
| CSS variables | kebab-case with prefix | `--search-snippet-primary-color` |
| Custom events | kebab-case | `search-complete` |

### Error Handling
- Use try-catch with typed errors: `(error as Error).message`
- Check for `AbortError` before showing error states
- Log errors with component prefix: `console.error('ComponentName:', error)`
- Throw descriptive errors: `throw new Error('API URL is required')`

## Architectural Patterns

### Web Component Registration
Always guard against duplicate registration:
```typescript
const COMPONENT_NAME = 'my-component';

if (!customElements.get(COMPONENT_NAME)) {
  customElements.define(COMPONENT_NAME, MyComponent);
}
```

### Event Handler Cleanup
Store handler references for proper cleanup in `disconnectedCallback`:
```typescript
private handleClick: ((e: Event) => void) | null = null;

private attachEventListeners(): void {
  this.handleClick = (e: Event) => { /* ... */ };
  this.element.addEventListener('click', this.handleClick);
}

private cleanup(): void {
  if (this.handleClick) {
    this.element.removeEventListener('click', this.handleClick);
  }
  this.handleClick = null;
}
```

### Custom Events
Use the `createCustomEvent` utility for Shadow DOM compatibility:
```typescript
import { createCustomEvent } from '../utils/index.ts';

this.dispatchEvent(createCustomEvent('search-complete', { results }));
```

### Security - XSS Prevention
Always sanitize user content before rendering:
```typescript
import { escapeHTML } from '../utils/index.ts';

element.innerHTML = `<div>${escapeHTML(userInput)}</div>`;
```

### CSS-in-JS Pattern
Styles are template literals exported from `src/styles/` modules:
```typescript
import { baseStyles } from '../styles/theme.ts';
import { searchStyles } from '../styles/search.ts';

const style = document.createElement('style');
style.textContent = `${baseStyles}\n${searchStyles}`;
this.shadow.appendChild(style);
```

### Async Generators for Streaming
```typescript
async *chat(query: string): AsyncGenerator<ChatTypes, void, undefined> {
  const response = await this.request(/* ... */);
  yield { type: 'text', message: content };
}
```

### Request Cancellation
Use AbortController for cancellable requests:
```typescript
private currentController: AbortController | null = null;

private async performRequest(): Promise<void> {
  if (this.currentController) {
    this.currentController.abort();
  }
  this.currentController = new AbortController();
  
  try {
    await fetch(url, { signal: this.currentController.signal });
  } catch (error) {
    if ((error as Error).name === 'AbortError') return;
    throw error;
  }
}
```

## File Organization

```
src/
├── api/           # API clients (abstract Client, AISearchClient)
├── components/    # Web Components (one per file)
├── styles/        # CSS-in-JS theme and component styles
├── types/         # TypeScript interfaces and types
├── utils/         # Utility functions (debounce, sanitize, etc.)
└── main.ts        # Library entry point and exports
```

## Common Pitfalls

1. **Missing `.ts` extension:** Always include in imports
2. **Forgetting event cleanup:** Store handler refs, clean in `disconnectedCallback`
3. **Unescaped HTML:** Always use `escapeHTML()` for user content
4. **Duplicate registration:** Guard `customElements.define()` calls
5. **Type-only imports:** Use `import type` for interfaces/types
6. **CSS variable prefix:** Always use `--search-snippet-` or `--chat-bubble-`
