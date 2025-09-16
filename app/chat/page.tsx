"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Home, MessageCircle, Newspaper, Users } from "lucide-react";
import Footer from "@/components/ui/Footer";

type Chat = {
  id: string;
  friend: { id: string; name: string };
  lastMessage: { content: string; sender: { name: string } } | null;
};

export default function RecentChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("/api/chats/recent");
      if (res.ok) {
        setChats(await res.json());
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="p-4 bg-gray-950 text-white h-screen">
      <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
      {chats.map((c) => (
  <div
    key={c.id}
    onClick={() => router.push(`/chat/${c.friend.id}`)}
    className="p-3 mb-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
  >
    <p className="font-medium">{c.friend?.name}</p>
    <p className="text-xs text-gray-400 truncate">
      {c.lastMessage?.content || "No messages yet"}
    </p>
  </div>
))}

      <Footer>
      </Footer>
    </div>
    
  );
}
