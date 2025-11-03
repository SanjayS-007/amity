import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

const weatherData = [
  { day: "Mon", temp: 28, icon: Sun, condition: "Sunny" },
  { day: "Tue", temp: 26, icon: Cloud, condition: "Cloudy" },
  { day: "Wed", temp: 24, icon: CloudRain, condition: "Rain" },
  { day: "Thu", temp: 27, icon: Sun, condition: "Sunny" },
  { day: "Fri", temp: 29, icon: Sun, condition: "Sunny" },
];

export function WeatherWidget() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">7-Day Weather</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wind className="w-4 h-4" />
          <span>12 km/h</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {weatherData.map((day, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
            <span className="text-sm font-medium w-12">{day.day}</span>
            <div className="flex items-center gap-2 flex-1">
              <day.icon className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">{day.condition}</span>
            </div>
            <span className="text-lg font-semibold">{day.temp}°C</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
