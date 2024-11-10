export interface Message {
  id: string;
  type: "text" | "image";
  content: string;
  timestamp: string;
  sender: "user" | "other";
  senderName: string;
  senderAvatar: string;
}

export interface ChatSettings {
  userName: string;
  otherName: string;
  userAvatar: string;
  otherAvatar: string;
}

export interface PhoneSettings {
  phoneTime: string;
  batteryLevel: number;
  wifiStrength: number;
  signalStrength: number;
}
