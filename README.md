# 🔍 Search Snippet Library

A production-ready, self-contained TypeScript Web Component library providing both search and chat interfaces with streaming support. Zero dependencies, fully customizable, and framework-agnostic.

## ✨ Features

- **🎨 Fully Customizable** - 20+ CSS variables for complete theme control
- **⚡ Zero Dependencies** - Self-contained with everything bundled
- **📱 Responsive Design** - Works seamlessly on all devices
- **🎭 Framework Agnostic** - Native Web Components work everywhere
- **♿ Accessible** - WCAG 2.1 AA compliant with ARIA support
- **🚀 Streaming Support** - Real-time streaming responses with low latency
- **🌓 Dark Mode** - Automatic theme switching based on system preferences
- **📦 Tiny Bundle** - Optimized for minimal size (< 50KB gzipped)
- **🔒 Secure** - XSS protection with HTML sanitization
- **⚙️ TypeScript** - Full type definitions included
- **🔍 Collapsible Search** - Search mode starts as an icon and expands on click

## 🚀 Quick Start

### Installation

```bash
npm install nlweb-cl-snippet
# or
yarn add nlweb-cl-snippet
```

### Basic Usage

```html
<!-- Import the library -->
<script type="module" src="https://cdn.example.com/search-snippet.es.js"></script>

<!-- Use in chat mode -->
<search-snippet 
    api-url="https://api.example.com"
    mode="chat"
    enable-streaming="true">
</search-snippet>

<!-- Use in search mode -->
<search-snippet 
    api-url="https://api.example.com"
    mode="search"
    max-results="10">
</search-snippet>
```

## 📖 API Reference

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | (required) | nlweb API endpoint URL |
| `mode` | `'search' \| 'chat'` | `'chat'` | Interface mode |
| `api-key` | string | - | Optional API authentication key |
| `placeholder` | string | Auto | Input placeholder text |
| `max-results` | number | 10 | Maximum search results to display |
| `debounce-ms` | number | 300 | Input debounce delay in milliseconds |
| `enable-streaming` | boolean | true | Enable/disable streaming responses |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color scheme |

### Properties (JavaScript API)

```typescript
// Get the component instance
const snippet = document.querySelector('search-snippet');

// Chat mode methods
snippet.sendMessage('Hello!');           // Send a message
const messages = snippet.getMessages();  // Get message history
snippet.clearChat();                     // Clear chat history

// Search mode methods
snippet.search('query');                 // Perform a search

// Common methods
snippet.setMode('chat');                 // Switch between modes
```

### Events

```javascript
const snippet = document.querySelector('search-snippet');

// Listen for events
snippet.addEventListener('ready', () => {
    console.log('Component ready');
});

snippet.addEventListener('search', (e) => {
    console.log('Search results:', e.detail.results);
});

snippet.addEventListener('message', (e) => {
    console.log('New message:', e.detail.message);
});

snippet.addEventListener('error', (e) => {
    console.error('Error:', e.detail.error);
});

snippet.addEventListener('modeChange', (e) => {
    console.log('Mode changed to:', e.detail.mode);
});
```

## 🎨 Customization

### CSS Variables

Customize the appearance using CSS variables:

```css
search-snippet {
    /* Colors */
    --search-snippet-primary-color: #0066cc;
    --search-snippet-primary-hover: #0052a3;
    --search-snippet-background: #ffffff;
    --search-snippet-text-color: #212529;
    --search-snippet-border-color: #dee2e6;
    
    /* Typography */
    --search-snippet-font-family: -apple-system, sans-serif;
    --search-snippet-font-size-base: 14px;
    --search-snippet-line-height: 1.5;
    
    /* Spacing */
    --search-snippet-spacing-md: 12px;
    --search-snippet-spacing-lg: 16px;
    
    /* Sizing */
    --search-snippet-max-height: 600px;
    --search-snippet-input-height: 44px;
    
    /* Border */
    --search-snippet-border-radius: 8px;
    
    /* Shadows */
    --search-snippet-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    /* Animation */
    --search-snippet-transition: 200ms ease;
}
```

### Theme Examples

**Dark Theme:**
```css
search-snippet {
    --search-snippet-primary-color: #4dabf7;
    --search-snippet-background: #1a1b1e;
    --search-snippet-text-color: #c1c2c5;
    --search-snippet-border-color: #373a40;
}
```

**Custom Brand:**
```css
search-snippet {
    --search-snippet-primary-color: #667eea;
    --search-snippet-primary-hover: #5568d3;
    --search-snippet-border-radius: 12px;
    --search-snippet-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}
```

## 🔧 Advanced Usage

### TypeScript

```typescript
import { SearchSnippet, type SearchSnippetProps, type Message } from 'nlweb-cl-snippet';

// Type-safe usage
const snippet = document.createElement('search-snippet') as SearchSnippet;
snippet.setAttribute('api-url', 'https://api.example.com');
snippet.setAttribute('mode', 'chat');

// Use typed methods
const messages: Message[] = snippet.getMessages();
await snippet.sendMessage('Hello, world!');
```

### React Integration

```tsx
import { useEffect, useRef } from 'react';
import 'nlweb-cl-snippet';

function ChatWidget() {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const snippet = ref.current;
        
        const handleMessage = (e: CustomEvent) => {
            console.log('Message:', e.detail);
        };

        snippet?.addEventListener('message', handleMessage as EventListener);
        
        return () => {
            snippet?.removeEventListener('message', handleMessage as EventListener);
        };
    }, []);

    return (
        <search-snippet
            ref={ref}
            api-url="https://api.example.com"
            mode="chat"
            enable-streaming={true}
        />
    );
}
```

### Vue Integration

```vue
<template>
    <search-snippet
        :api-url="apiUrl"
        mode="chat"
        @message="handleMessage"
        @error="handleError"
    />
</template>

<script setup>
import { ref } from 'vue';
import 'nlweb-cl-snippet';

const apiUrl = ref('https://api.example.com');

const handleMessage = (event) => {
    console.log('Message:', event.detail.message);
};

const handleError = (event) => {
    console.error('Error:', event.detail.error);
};
</script>
```

## 🏗️ Development

### Build from Source

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and format
npm run lint
npm run format
```

### Project Structure

```
nlweb-cl-snippet/
├── src/
│   ├── api/
│   │   ├── nlweb-client.ts      # API client with streaming
│   │   └── ask-api.ts            # Legacy API wrapper
│   ├── components/
│   │   ├── search-snippet.ts     # Main web component
│   │   ├── search-view.ts        # Search interface
│   │   └── chat-view.ts          # Chat interface
│   ├── styles/
│   │   ├── theme.ts              # Base styles & CSS variables
│   │   ├── search.ts             # Search-specific styles
│   │   └── chat.ts               # Chat-specific styles
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── utils/
│   │   └── index.ts              # Utility functions
│   └── main.ts                   # Entry point
├── dist/                          # Build output
├── index.html                     # Demo page
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 📝 API Server Requirements

The component expects the API server to implement the following endpoints:

### Search Endpoint

**POST** `/search`

Request:
```json
{
    "query": "search query",
    "max_results": 10,
    "filters": {}
}
```

Response:
```json
{
    "results": [
        {
            "id": "result-1",
            "title": "Result Title",
            "snippet": "Result description...",
            "url": "https://example.com",
            "metadata": {}
        }
    ],
    "total": 42
}
```

### Chat Endpoint (Streaming)

**POST** `/ask`

Request:
```json
{
    "query": "user message",
    "generate_mode": "summarize",
    "prev": [
        {
            "role": "user",
            "content": "previous message",
            "timestamp": 1234567890
        }
    ]
}
```

Response: Streaming text chunks via ReadableStream

## 🧪 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and version

## 📮 Support

For questions and support, please open a GitHub issue.

---

Built with TypeScript, Web Components, and ❤️
