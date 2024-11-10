import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Send, Image as ImageIcon } from "lucide-react";
import { Message, ChatSettings } from "@/types/whatsapp";

interface MessageFormProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  inputDate: string;
  setInputDate: (date: string) => void;
  inputTime: string;
  setInputTime: (time: string) => void;
  isUser: boolean;
  setIsUser: (isUser: boolean) => void;
  chatSettings: ChatSettings;
  onSendMessage: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MessageForm({
  inputMessage,
  setInputMessage,
  inputDate,
  setInputDate,
  inputTime,
  setInputTime,
  isUser,
  setIsUser,
  chatSettings,
  onSendMessage,
  onImageUpload,
}: MessageFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="sender-switch"
          checked={isUser}
          onCheckedChange={setIsUser}
        />
        <Label htmlFor="sender-switch">
          Sending as: {isUser ? chatSettings.userName : chatSettings.otherName}
        </Label>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="time">Time</Label>
          <Input
            type="time"
            id="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={onSendMessage} className="flex-1">
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
        <Label htmlFor="image-upload" className="flex-1">
          <Button variant="outline" className="w-full">
            <ImageIcon className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </Label>
      </div>
    </div>
  );
}
