"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageForm } from "./whatsapp/message-form";
import { ContactSettings } from "./whatsapp/contact-settings";
import { PhoneSettingsForm } from "./whatsapp/phone-settings";
import { ChatPreview } from "./whatsapp/chat-preview";
import { Message } from "@/types/whatsapp";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export function WhatsappChatCreator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [isUser, setIsUser] = useState(true);
  const [otherName, setOtherName] = useState("John Doe");
  const [otherAvatar, setOtherAvatar] = useState(
    "/placeholder.svg?height=32&width=32"
  );
  const [phoneTime, setPhoneTime] = useState("11:30");
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [wifiStrength, setWifiStrength] = useState(100);
  const [signalStrength, setSignalStrength] = useState(100);

  useEffect(() => {
    const storedMessages = localStorage.getItem("fakeWhatsappMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fakeWhatsappMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const now = new Date();
      const messageDate = inputDate || format(now, "yyyy-MM-dd");
      const messageTime = inputTime || format(now, "HH:mm");

      const newMessage: Message = {
        id: Date.now().toString(),
        type: "text",
        content: inputMessage.trim(),
        timestamp: new Date(`${messageDate} ${messageTime}`).getTime(),
        sender: isUser ? "user" : "other",
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const now = new Date();
        const messageDate = inputDate || format(now, "yyyy-MM-dd");
        const messageTime = inputTime || format(now, "HH:mm");

        const newMessage: Message = {
          id: Date.now().toString(),
          type: "image",
          content: e.target?.result as string,
          timestamp: new Date(`${messageDate} ${messageTime}`).getTime(),
          sender: isUser ? "user" : "other",
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    isUserAvatar: boolean
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (isUserAvatar) {
          setOtherAvatar(result);
        } else {
          setOtherAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setMessages([]);
    localStorage.removeItem("fakeWhatsappMessages");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/3 p-4 bg-white overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Fake WhatsApp Message</h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </div>
        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="message">
            <Card>
              <CardHeader>
                <CardTitle>Message Settings</CardTitle>
                <CardDescription>Customize your message here.</CardDescription>
              </CardHeader>
              <CardContent>
                <MessageForm
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  inputDate={inputDate}
                  setInputDate={setInputDate}
                  inputTime={inputTime}
                  setInputTime={setInputTime}
                  isUser={isUser}
                  setIsUser={setIsUser}
                  chatSettings={{
                    otherName,
                    otherAvatar,
                  }}
                  onSendMessage={handleSendMessage}
                  onImageUpload={handleImageUpload}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Settings</CardTitle>
                <CardDescription>
                  Customize contact details here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactSettings
                  chatSettings={{
                    otherName,
                    otherAvatar,
                  }}
                  onUpdateSettings={(settings) => {
                    if (settings.otherName) setOtherName(settings.otherName);
                  }}
                  onAvatarUpload={handleAvatarUpload}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="phone">
            <Card>
              <CardHeader>
                <CardTitle>Phone Settings</CardTitle>
                <CardDescription>Customize phone details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <PhoneSettingsForm
                  settings={{
                    phoneTime,
                    batteryLevel,
                    wifiStrength,
                    signalStrength,
                  }}
                  onUpdateSettings={(settings) => {
                    if (settings.phoneTime) setPhoneTime(settings.phoneTime);
                    if (settings.batteryLevel)
                      setBatteryLevel(settings.batteryLevel);
                    if (settings.wifiStrength)
                      setWifiStrength(settings.wifiStrength);
                    if (settings.signalStrength)
                      setSignalStrength(settings.signalStrength);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full md:w-2/3 p-4 flex justify-center items-start">
        <ChatPreview
          messages={messages}
          chatSettings={{ otherName, otherAvatar }}
          phoneSettings={{
            phoneTime,
            batteryLevel,
            wifiStrength,
            signalStrength,
          }}
        />
      </div>
    </div>
  );
}
