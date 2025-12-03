# Nexus Tab - Chrome New Tab Extension

A beautiful, customizable new tab experience with widgets, quick links, and productivity tools.

## Features

- **Clock Widget** - Large time display with multiple timezone support
- **Weather Widget** - Current weather and 5-day forecast (requires OpenWeatherMap API)
- **Todo List** - Task management with categories
- **Pomodoro Timer** - Focus timer with work/break cycles
- **Quick Notes** - Auto-saving scratchpad
- **Quick Links** - Customizable grid of favorite sites with drag-and-drop
- **Custom Fonts** - Choose from Google Fonts for headings, body, and monospace
- **Background Customization** - Gradients, solid colors, or Unsplash images

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

## Keyboard Shortcuts (Coming Soon)

- `Ctrl/Cmd + K` - Focus search
- `Ctrl/Cmd + T` - Add new todo
- `Ctrl/Cmd + N` - Open notes

## License

MIT
