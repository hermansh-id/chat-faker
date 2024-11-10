import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneSettings } from "@/types/whatsapp";

interface PhoneSettingsFormProps {
  settings: PhoneSettings;
  onUpdateSettings: (settings: Partial<PhoneSettings>) => void;
}

export function PhoneSettingsForm({
  settings,
  onUpdateSettings,
}: PhoneSettingsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phone-time">Phone Time</Label>
        <Input
          id="phone-time"
          type="time"
          value={settings.phoneTime}
          onChange={(e) => onUpdateSettings({ phoneTime: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="battery-level">Battery Level (%)</Label>
        <Input
          id="battery-level"
          type="number"
          min="0"
          max="100"
          value={settings.batteryLevel}
          onChange={(e) =>
            onUpdateSettings({ batteryLevel: Number(e.target.value) })
          }
        />
      </div>
      <div>
        <Label htmlFor="wifi-strength">WiFi Strength (%)</Label>
        <Input
          id="wifi-strength"
          type="number"
          min="0"
          max="100"
          value={settings.wifiStrength}
          onChange={(e) =>
            onUpdateSettings({ wifiStrength: Number(e.target.value) })
          }
        />
      </div>
      <div>
        <Label htmlFor="signal-strength">Signal Strength (%)</Label>
        <Input
          id="signal-strength"
          type="number"
          min="0"
          max="100"
          value={settings.signalStrength}
          onChange={(e) =>
            onUpdateSettings({ signalStrength: Number(e.target.value) })
          }
        />
      </div>
    </div>
  );
}
