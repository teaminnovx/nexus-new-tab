import { useEffect } from 'react';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { Background } from '@/components/Background';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ClockWidget } from '@/components/widgets/ClockWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { TodoWidget } from '@/components/widgets/TodoWidget';
import { PomodoroWidget } from '@/components/widgets/PomodoroWidget';
import { NotesWidget } from '@/components/widgets/NotesWidget';
import { QuickLinksWidget } from '@/components/widgets/QuickLinksWidget';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
  const { widgetLayout, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const widgets = [
    { key: 'clock', component: ClockWidget },
    { key: 'weather', component: WeatherWidget },
    { key: 'todos', component: TodoWidget },
    { key: 'pomodoro', component: PomodoroWidget },
    { key: 'notes', component: NotesWidget },
    { key: 'quickLinks', component: QuickLinksWidget },
  ];

  const sortedWidgets = widgets
    .filter((w) => widgetLayout?.[w.key as keyof typeof widgetLayout]?.visible !== false)
    .sort((a, b) => {
      const orderA = widgetLayout?.[a.key as keyof typeof widgetLayout]?.order ?? 0;
      const orderB = widgetLayout?.[b.key as keyof typeof widgetLayout]?.order ?? 0;
      return orderA - orderB;
    });

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-heading font-bold gradient-text mb-1">Nexus Tab</h1>
        <p className="text-sm text-muted-foreground">Your personalized new tab experience</p>
      </header>

      {/* Widget Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWidgets.map(({ key, component: Component }) => (
            <div key={key} className="animate-slide-up" style={{ animationDelay: `${sortedWidgets.findIndex(w => w.key === key) * 100}ms` }}>
              <Component />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-6 left-6 text-xs text-muted-foreground/50">
        <kbd className="px-1.5 py-0.5 rounded bg-muted/30 mr-1">Ctrl</kbd>+
        <kbd className="px-1.5 py-0.5 rounded bg-muted/30 mx-1">K</kbd>
        Search
      </footer>
    </div>
  );
}

const Index = () => {
  return (
    <SettingsProvider>
      <Background />
      <DashboardContent />
      <SettingsPanel />
    </SettingsProvider>
  );
};

export default Index;
