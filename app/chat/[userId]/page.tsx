"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; image?: string | null };
};

type ChatData = {
  id: string;
  users: { user: { id: string; name: string; image?: string | null } }[];
  messages: Message[];
};

export default function ChatPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const params = useParams();
  const friendId = params?.userId as string;

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [friend, setFriend] = useState<{ id: string; name: string; image?: string | null } | null>(null);
  const [input, setInput] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!currentUserId) return;
    const fetchChat = async () => {
      const res = await fetch(`/api/chat/${friendId}`);
      if (res.ok) {
        const data: ChatData = await res.json();
        setChatId(data.id);
        setMessages(data.messages);

        const other = data.users.find((u) => u.user.id !== currentUserId)?.user;
        setFriend(other || null);
      }
    };
    fetchChat();
  }, [friendId, currentUserId]);

  const sendMessage = async () => {
    if (!chatId || !input.trim() || !currentUserId) return;

    const res = await fetch(`/api/chat/${chatId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    if (res.ok) {
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">

      

      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">

        
        <div className="flex items-center gap-3">
          <button
          onClick={() => router.push("/chat")}
          className="p-2 hover:bg-gray-800 rounded-full"
        >
          <ArrowLeft size={22} />
        </button>
          {friend?.image ? (
            <img
              src={friend.image}
              alt={friend.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm">{friend?.name?.[0] || "?"}</span>
            </div>
          )}
          <p className="font-semibold">{friend?.name || "Unknown"}</p>
        </div>

        
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMe = m.sender.id === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                  isMe
                    ? "bg-blue-600 text-white rounded-bl-none"
                    : "bg-green-600 text-white rounded-br-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>


      <div className="flex p-2 border-t border-gray-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-800 outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-green-600 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
