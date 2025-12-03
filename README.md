# Nexus Tab - Chrome New Tab Extension

A beautiful, customizable new tab experience with widgets, quick links, and productivity tools.

## Features

### 🎯 Productivity Widgets

- **Search Widget** - Quick web search using your browser's default search engine
- **Clock Widget** - Large time display with multiple timezone support
- **Weather Widget** - Current weather and 5-day forecast (requires OpenWeatherMap API key)
- **Todo List** - Task management with categories and completion tracking
- **Pomodoro Timer** - Focus timer with work/break cycles and session stats
- **Quick Notes** - Auto-saving scratchpad for quick thoughts

### 🔗 Quick Access

- **Quick Links** - Customizable grid of favorite sites with favicons and drag-and-drop
- **Google Apps Widget** - Quick access to Gmail, Drive, Calendar, Photos, Maps, Docs, Sheets, Meet
- **AI Tools Widget** - One-click access to ChatGPT, Claude, Gemini, Perplexity, Midjourney, HuggingFace
- **Music Widget** - Fast links to Spotify and YouTube Music with integrated search

### 🎨 Customization

- **Custom Fonts** - Choose from Google Fonts for headings, body, and monospace text
- **Background Options** - Gradients, solid colors, or daily Unsplash images
- **Widget Layout** - Toggle visibility and reorder widgets to your preference
- **Theme Support** - Automatic text color adjustment based on background

## Setup Instructions

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Chrome

```bash
# Build the extension
npm run build

# The built extension will be in the 'dist' folder
```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project
5. Open a new tab to see Nexus Tab!

## API Setup

### OpenWeatherMap (Weather Widget)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the API keys section
4. In Nexus Tab, click the settings icon on the Weather widget
5. Enter your API key and location

## Widget Overview

### Search Widget
- Prominent search bar at the top of the page
- Uses your browser's default search engine (Chrome Web Store compliant)
- Press Enter to search

### Google Apps Widget
- Pre-configured with 8 popular Google services
- Add custom apps with name, URL, and icon
- Drag-and-drop to reorder
- Click to open in new tab

### AI Tools Widget
- Quick access to 6 popular AI platforms
- Customize with your own AI tools
- Brand color support for visual distinction
- Drag-and-drop reordering

### Music Widget
- Tab switcher for Spotify and YouTube Music
- Quick links: Home, Search/Explore, Library, Liked Songs
- Integrated search that opens results in your chosen service
- Remembers your preferred service

### Quick Links
- Chrome-style centered layout
- Automatic favicon fetching
- Drag-and-drop reordering
- Add unlimited custom links

## Customization

### Background Options

- **Gradient** - Choose from presets or create custom gradients
- **Solid Color** - Pick any color
- **Unsplash** - Random daily images based on search query

### Font Options

Choose fonts for:
- Headings (Space Grotesk, Playfair Display, etc.)
- Body text (Inter, Poppins, etc.)
- Monospace (JetBrains Mono, Fira Code, etc.)

### Widget Layout

Toggle visibility of individual widgets in the Settings panel.

## Technology Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- Chrome Storage API

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn components
│   ├── widgets/      # Widget components
│   │   ├── ClockWidget.tsx
│   │   ├── WeatherWidget.tsx
│   │   ├── TodoWidget.tsx
│   │   ├── PomodoroWidget.tsx
│   │   ├── NotesWidget.tsx
│   │   ├── QuickLinksWidget.tsx
│   │   ├── SearchWidget.tsx
│   │   ├── GoogleAppsWidget.tsx
│   │   ├── AIToolsWidget.tsx
│   │   └── MusicWidget.tsx
│   ├── Background.tsx
│   └── SettingsPanel.tsx
├── contexts/
│   └── SettingsContext.tsx
├── hooks/
│   └── useStorage.ts
├── lib/
│   ├── fonts.ts      # Font loading utilities
│   ├── storage.ts    # Chrome storage wrapper
│   └── utils.ts
└── pages/
    └── Index.tsx     # Main dashboard
```

## Keyboard Shortcuts

- Press `Enter` in search widget to search
- Press `Enter` in music widget search to find songs/artists
- Drag widgets to reorder (for supported widgets)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT
