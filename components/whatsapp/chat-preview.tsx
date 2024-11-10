import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Battery,
  Wifi,
  SignalHigh,
  User,
  Send,
  Download,
  Camera,
  Image,
  Mic,
  Phone,
  Video,
  MoreVertical,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toPng } from "html-to-image";
import { Roboto } from "next/font/google";

// Define fonts
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const PHONE_PRESETS = {
  iphone15: {
    name: "iPhone 15",
    statusBarHeight: "47px",
    notchSize: "large",
    fontClass: "-apple-system", // Keep system font for iPhone
    width: "430px",
    height: "932px",
  },
  android: {
    name: "Android",
    statusBarHeight: "36px",
    notchSize: "small",
    fontClass: roboto.variable, // Use Roboto font variable
    width: "432px",
    height: "960px",
  },
};

interface Message {
  id: string;
  sender: "user" | "other";
  content: string;
  timestamp: number;
  type: "text" | "image";
}

interface ChatSettings {
  otherName: string;
  otherAvatar?: string;
  otherStatus?: string;
}

interface PhoneSettings {
  phoneTime: string;
  signalStrength: number;
  wifiStrength: number;
  batteryLevel: number;
}

interface ChatPreviewProps {
  messages: Message[];
  chatSettings: ChatSettings;
  phoneSettings: PhoneSettings;
}

export function ChatPreview({
  messages,
  chatSettings,
  phoneSettings,
}: ChatPreviewProps) {
  const [preset, setPreset] = useState<keyof typeof PHONE_PRESETS>("android");
  const [newMessage, setNewMessage] = useState("");
  const currentPreset = PHONE_PRESETS[preset];

  const handleDownload = async () => {
    const element = document.getElementById("whatsapp-preview");
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "whatsapp-chat.png";
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-md mb-4">
        <Select
          defaultValue={preset}
          onValueChange={(value: keyof typeof PHONE_PRESETS) =>
            setPreset(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select phone preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iphone15">iPhone 15</SelectItem>
            <SelectItem value="android">Android</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        id="whatsapp-preview"
        className={`w-[400px] max-w-md bg-black overflow-hidden shadow-xl ${
          preset === "android" ? roboto.className : ""
        }`}
        style={{
          width: currentPreset.width,
          height: currentPreset.height,
          fontFamily:
            preset === "android" ? "var(--font-roboto)" : "-apple-system",
          backgroundImage: "url('/images/bg-wa.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        {/* Status Bar */}
        <div
          className="bg-gray-800 text-white px-4 flex justify-between items-center text-xs"
          style={{ height: currentPreset.statusBarHeight }}
        >
          <div className="flex items-center gap-1">
            <span>{phoneSettings.phoneTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SignalHigh
              className="h-4 w-4"
              style={{ opacity: phoneSettings.signalStrength / 100 }}
            />
            <Wifi
              className="h-4 w-4"
              style={{ opacity: phoneSettings.wifiStrength / 100 }}
            />
            <Battery className="h-4 w-4" />
            <span>{phoneSettings.batteryLevel}%</span>
          </div>
        </div>

        {/* Chat Header */}
        <div className="bg-white text-black px-2 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="p-0 h-auto hover:bg-transparent flex items-center"
            >
              <ArrowLeft className="h-6 w-6" />
              <Avatar className="h-10 w-10 border-2 border-white/20 ml-[-8px]">
                <AvatarImage
                  src={chatSettings.otherAvatar}
                  alt={chatSettings.otherName}
                />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </Button>
            <div>
              <h2 className="text-[17px]">{chatSettings.otherName}</h2>
              <p className="text-[11px] mt-[-5px]">
                {chatSettings.otherStatus || "online"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0">
            <Button className="h-10 w-10 text-10" variant="ghost" size="icon">
              <Video />
            </Button>
            <Button variant="ghost" size="icon">
              <Phone className="h-10 w-10" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-10 w-10" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="overflow-y-auto p-4"
          style={{
            height: `calc(${currentPreset.height} - ${currentPreset.statusBarHeight} - 56px - 52px)`,
          }}
        >
          {messages.map((message, index) => {
            // Check if this is the first message in a sequence
            const isFirstInSequence =
              index === 0 || messages[index - 1].sender !== message.sender;
            // Check if this is the last message in a sequence
            const isLastInSequence =
              index === messages.length - 1 ||
              messages[index + 1].sender !== message.sender;

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end message-out"
                    : "justify-start message-in"
                } ${isLastInSequence ? "mb-3" : "mb-[2px]"}`}
              >
                <div
                  className={`relative max-w-[70%] ${
                    message.sender === "user"
                      ? "rounded-lg rounded-tr-none bg-[#E7FFDB]"
                      : "rounded-lg rounded-tl-none bg-white"
                  } pr-2 pl-3 py-2 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] z-[2]`}
                >
                  {isFirstInSequence &&
                    (message.sender === "user" ? (
                      <span className="absolute top-0 right-[-8px] z-[1] block w-[8px] h-[13px] text-[#E7FFDB]">
                        <svg
                          viewBox="0 0 8 13"
                          height="13"
                          width="8"
                          preserveAspectRatio="xMidYMid meet"
                          version="1.1"
                        >
                          <path
                            opacity="0.13"
                            d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
                          ></path>
                        </svg>
                      </span>
                    ) : (
                      <span className="absolute top-0 left-[-8px] z-[1] block w-[8px] h-[13px] text-white">
                        <svg
                          viewBox="0 0 8 13"
                          height="13"
                          width="8"
                          preserveAspectRatio="xMidYMid meet"
                          version="1.1"
                        >
                          <path
                            opacity="0.13"
                            fill="#0000000"
                            d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"
                          ></path>
                          <path
                            fill="white"
                            d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"
                          ></path>
                        </svg>
                      </span>
                    ))}
                  <div className="flex flex-col">
                    {message.type === "text" ? (
                      <div className="break-words">
                        <span className="text-[14.2px] leading-[19px]">
                          {message.content}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={message.content}
                        alt="Uploaded image"
                        className="max-w-full h-auto rounded"
                      />
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[11px] text-[#667781]">
                        {new Date(message.timestamp).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                      {message.sender === "user" && (
                        <svg
                          viewBox="0 0 16 11"
                          height="11"
                          width="16"
                          className="text-[#53bdeb]"
                        >
                          <path
                            d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="bg-transparent p-2 flex items-center gap-2 mt-[-25px]">
          <div className="flex-1 flex items-center bg-white rounded-3xl px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#54656f] h-8 w-8 hover:bg-transparent"
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                className="fill-[#54656f]"
              >
                <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path>
              </svg>
            </Button>
            <input
              type="text"
              placeholder="Message"
              className="flex-1 bg-transparent border-0 focus:ring-0 text-[15px] placeholder:text-[#3b4a54] px-2 leading-normal"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ lineHeight: "1.2em" }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-[#54656f] h-8 w-8 hover:bg-transparent"
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                className="fill-[#54656f]"
              >
                <path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path>
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#54656f] h-8 w-8 hover:bg-transparent"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#00a884] hover:bg-[#00a884]/90 text-white rounded-full h-10 w-10 flex items-center justify-center"
          >
            {newMessage ? (
              <Send className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <Button
        onClick={handleDownload}
        className="w-full max-w-sm flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download as Image
      </Button>
    </div>
  );
}
