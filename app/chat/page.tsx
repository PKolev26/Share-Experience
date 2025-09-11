"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Home, MessageCircle, Newspaper, Users } from "lucide-react";

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

      <div className="absolute bottom-0 left-0 right-0 bg-black py-2 flex justify-around items-center shadow-lg">
        <button
          onClick={() => router.push("/friends")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <Users size={22} />
          <span className="text-xs">Friends</span>
        </button>

        <button
          onClick={() => router.push("/feed")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <Newspaper size={22} />
          <span className="text-xs">Feed</span>
        </button>

        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <Home size={22} />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => router.push("/chat")}
          className="flex flex-col items-center flex-1 text-blue-500"
        >
          <MessageCircle size={22} />
          <span className="text-xs">Chat</span>
        </button>

        <button
          onClick={() => router.push("/reviews")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <FileText size={22} />
          <span className="text-xs">Reviews</span>
        </button>
      </div>
    </div>
    
  );
}
