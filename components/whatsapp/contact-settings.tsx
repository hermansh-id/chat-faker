import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatSettings } from "@/types/whatsapp";

interface ContactSettingsProps {
  chatSettings: ChatSettings;
  onUpdateSettings: (settings: Partial<ChatSettings>) => void;
  onAvatarUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    isUser: boolean
  ) => void;
}

export function ContactSettings({
  chatSettings,
  onUpdateSettings,
  onAvatarUpload,
}: ContactSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="user-name">Your Name</Label>
        <Input
          id="user-name"
          value={chatSettings.userName}
          onChange={(e) => onUpdateSettings({ userName: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="other-name">Other Person's Name</Label>
        <Input
          id="other-name"
          value={chatSettings.otherName}
          onChange={(e) => onUpdateSettings({ otherName: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="user-avatar">Your Avatar</Label>
        <Input
          id="user-avatar"
          type="file"
          accept="image/*"
          onChange={(e) => onAvatarUpload(e, true)}
        />
      </div>
      <div>
        <Label htmlFor="other-avatar">Other Person's Avatar</Label>
        <Input
          id="other-avatar"
          type="file"
          accept="image/*"
          onChange={(e) => onAvatarUpload(e, false)}
        />
      </div>
    </div>
  );
}
