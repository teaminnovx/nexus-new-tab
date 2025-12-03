import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, MapPin, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStorage } from '@/hooks/useStorage';
import { WeatherSettings } from '@/lib/storage';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
  forecast?: ForecastDay[];
}

interface ForecastDay {
  date: string;
  temp: number;
  icon: string;
}

const weatherIcons: Record<string, React.ReactNode> = {
  '01d': <Sun className="w-12 h-12 text-yellow-400" />,
  '01n': <Sun className="w-12 h-12 text-yellow-300" />,
  '02d': <Cloud className="w-12 h-12 text-gray-400" />,
  '02n': <Cloud className="w-12 h-12 text-gray-500" />,
  '03d': <Cloud className="w-12 h-12 text-gray-400" />,
  '03n': <Cloud className="w-12 h-12 text-gray-500" />,
  '04d': <Cloud className="w-12 h-12 text-gray-500" />,
  '04n': <Cloud className="w-12 h-12 text-gray-600" />,
  '09d': <CloudRain className="w-12 h-12 text-blue-400" />,
  '09n': <CloudRain className="w-12 h-12 text-blue-500" />,
  '10d': <CloudRain className="w-12 h-12 text-blue-400" />,
  '10n': <CloudRain className="w-12 h-12 text-blue-500" />,
  '13d': <CloudSnow className="w-12 h-12 text-blue-200" />,
  '13n': <CloudSnow className="w-12 h-12 text-blue-300" />,
  default: <Cloud className="w-12 h-12 text-gray-400" />,
};

export function WeatherWidget() {
  const [settings, setSettings] = useStorage('weatherSettings');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [tempLocation, setTempLocation] = useState('');

  useEffect(() => {
    if (settings?.apiKey && settings?.location) {
      fetchWeather(settings);
    }
  }, [settings?.apiKey, settings?.location]);

  const fetchWeather = async (weatherSettings: WeatherSettings) => {
    if (!weatherSettings.apiKey || !weatherSettings.location) return;

    setLoading(true);
    setError(null);

    try {
      // Current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          weatherSettings.location
        )}&units=${weatherSettings.units}&appid=${weatherSettings.apiKey}`
      );

      if (!currentRes.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const currentData = await currentRes.json();

      // 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          weatherSettings.location
        )}&units=${weatherSettings.units}&appid=${weatherSettings.apiKey}`
      );

      let forecast: ForecastDay[] = [];
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        // Get one reading per day (noon)
        const dailyData = forecastData.list.filter((_: any, index: number) => index % 8 === 0);
        forecast = dailyData.slice(0, 5).map((day: any) => ({
          date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(day.main.temp),
          icon: day.weather[0].icon,
        }));
      }

      setWeather({
        temp: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed),
        city: currentData.name,
        forecast,
      });
    } catch (err) {
      setError('Failed to load weather. Check your API key and location.');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    await setSettings({
      ...settings!,
      apiKey: tempApiKey || settings?.apiKey || '',
      location: tempLocation || settings?.location || '',
      units: settings?.units || 'metric',
    });
    setShowSettings(false);
  };

  const getWeatherIcon = (iconCode: string) => {
    return weatherIcons[iconCode] || weatherIcons.default;
  };

  const needsSetup = !settings?.apiKey || !settings?.location;

  return (
    <div className="widget animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Cloud className="w-4 h-4" />
          <span className="text-sm font-medium">Weather</span>
        </div>
        <Popover open={showSettings} onOpenChange={setShowSettings}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 glass" align="end">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">OpenWeatherMap API Key</label>
                <Input
                  type="password"
                  placeholder="Enter API key"
                  defaultValue={settings?.apiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get free key at openweathermap.org
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input
                  placeholder="City name"
                  defaultValue={settings?.location}
                  onChange={(e) => setTempLocation(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <Button onClick={saveSettings} className="w-full">
                Save Settings
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {needsSetup ? (
        <div className="text-center py-6">
          <Cloud className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">Set up weather</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            Configure
          </Button>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-sm text-destructive mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
            Check Settings
          </Button>
        </div>
      ) : weather ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="w-3 h-3" />
                {weather.city}
              </div>
              <div className="text-5xl font-heading font-bold">
                {weather.temp}°
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {weather.description}
              </p>
            </div>
            <div>{getWeatherIcon(weather.icon)}</div>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Droplets className="w-4 h-4" />
              {weather.humidity}%
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-4 h-4" />
              {weather.windSpeed} {settings?.units === 'metric' ? 'm/s' : 'mph'}
            </div>
          </div>

          {weather.forecast && weather.forecast.length > 0 && (
            <div className="border-t border-border/50 pt-3">
              <div className="grid grid-cols-5 gap-2 text-center">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-xs">
                    <div className="text-muted-foreground mb-1">{day.date}</div>
                    <div className="text-lg font-medium">{day.temp}°</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
