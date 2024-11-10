export interface Message {
  id: string;
  sender: "user" | "other";
  content: string;
  timestamp: number;
  type: "text" | "image";
}

export interface ChatSettings {
  otherName: string;
  otherAvatar?: string;
  otherStatus?: string;
}

export interface PhoneSettings {
  phoneTime: string;
  batteryLevel: number;
  wifiStrength: number;
  signalStrength: number;
}
