import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Plus, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/hooks/useStorage';

interface TimezoneDisplay {
  zone: string;
  label: string;
}

const popularTimezones = [
  { zone: 'America/New_York', label: 'New York' },
  { zone: 'America/Los_Angeles', label: 'Los Angeles' },
  { zone: 'Europe/London', label: 'London' },
  { zone: 'Europe/Paris', label: 'Paris' },
  { zone: 'Asia/Tokyo', label: 'Tokyo' },
  { zone: 'Asia/Singapore', label: 'Singapore' },
  { zone: 'Australia/Sydney', label: 'Sydney' },
];

export function ClockWidget() {
  const [time, setTime] = useState(new Date());
  const [timezones, setTimezones] = useStorage('timezones');
  const [showAddPopover, setShowAddPopover] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeInTimezone = (timezone: string) => {
    try {
      if (timezone === 'local') {
        return format(time, 'HH:mm:ss');
      }
      return time.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return format(time, 'HH:mm:ss');
    }
  };

  const addTimezone = async (tz: TimezoneDisplay) => {
    if (timezones && !timezones.includes(tz.zone)) {
      await setTimezones([...timezones, tz.zone]);
    }
    setShowAddPopover(false);
  };

  const removeTimezone = async (zone: string) => {
    if (timezones) {
      await setTimezones(timezones.filter((tz) => tz !== zone));
    }
  };

  const getTimezoneLabel = (zone: string) => {
    if (zone === 'local') return 'Local';
    const found = popularTimezones.find((tz) => tz.zone === zone);
    return found?.label || zone.split('/').pop()?.replace('_', ' ') || zone;
  };

  return (
    <div className="widget animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Clock</span>
        </div>
        <Popover open={showAddPopover} onOpenChange={setShowAddPopover}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 glass" align="end">
            <div className="space-y-2">
              <p className="text-sm font-medium mb-2">Add Timezone</p>
              {popularTimezones
                .filter((tz) => !timezones?.includes(tz.zone))
                .map((tz) => (
                  <Button
                    key={tz.zone}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => addTimezone(tz)}
                  >
                    <Globe className="w-3 h-3 mr-2" />
                    {tz.label}
                  </Button>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Main local time */}
      <div className="text-center mb-4">
        <div className="text-6xl font-heading font-bold tracking-tight gradient-text">
          {format(time, 'HH:mm')}
        </div>
        <div className="text-2xl font-light text-muted-foreground">
          {format(time, 'ss')}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          {format(time, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Additional timezones */}
      {timezones && timezones.filter((tz) => tz !== 'local').length > 0 && (
        <div className="border-t border-border/50 pt-3 mt-3 space-y-2">
          {timezones
            .filter((tz) => tz !== 'local')
            .map((zone) => (
              <div
                key={zone}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{getTimezoneLabel(zone)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{getTimeInTimezone(zone)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-50 hover:opacity-100"
                    onClick={() => removeTimezone(zone)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
