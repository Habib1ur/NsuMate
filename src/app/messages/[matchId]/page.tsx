"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Message = {
  id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export default function ChatPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      const res = await fetch(`/api/messages/${matchId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (active) setMessages(data.messages);
    }
    load();
    const interval = setInterval(load, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [matchId]);

  async function sendMessage() {
    if (!input.trim()) return;
    await fetch(`/api/messages/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input })
    });
    setInput("");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
      <h1 className="text-xl font-semibold mb-4">Chat</h1>
      <div className="flex-1 overflow-y-auto rounded-lg border bg-white p-3 space-y-2 text-sm">
        {messages.map((m) => (
          <div key={m.id} className="flex justify-start">
            <div className="max-w-[70%] rounded-lg bg-primary-50 px-3 py-2 text-xs text-slate-800">
              <p>{m.content}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="button" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}

