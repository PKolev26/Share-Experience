"use client";

import { useEffect, useState } from "react";
import { UserPlus, Search, Home, FileText, Users, Newspaper, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Friend = {
  id: string;
  name: string;
  image?: string | null;
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Friend[]>([]);
  const router = useRouter();
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("/api/friends");
      if (res.ok) {
        setFriends(await res.json());
      }
    };
    fetchFriends();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    const res = await fetch(`/api/friends/search?query=${search}`);
    if (res.ok) {
      setResults(await res.json());
    }
  };

  const handleAddFriend = async (friendId: string) => {
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });

    if (res.ok) {
      const newFriend = await res.json();
      setFriends((prev) => [...prev, newFriend]);
      setIsDialogOpen(false);
      setSearch("");
      setResults([]);
    }
  };

  const handleRemoveFriend = async () => {
    if (!friendToRemove) return;

    const res = await fetch(`/api/friends/${friendToRemove.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFriends((prev) => prev.filter((f) => f.id !== friendToRemove.id));
      setFriendToRemove(null);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Friends</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-3 py-2 rounded"
        >
          <UserPlus size={18} />
          <span>Add Friend</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {friends.length > 0 ? (
          friends.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-800"
            >
              {f.image ? (
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm">{f?.name?.[0] || "?"}</span>
            </div>
              )}
              <span className="font-medium">{f.name}</span>
              <button
  onClick={() => router.push(`/chat/${f.id}`)}
  className="ml-auto px-3 py-1 bg-blue-600 text-xs rounded hover:bg-blue-500"
>
  💬 Chat
</button>
<button
                onClick={() => setFriendToRemove(f)}
                className="px-3 py-1 bg-red-600 text-xs rounded hover:bg-red-500"
              >
                ❌ Remove
              </button>

            </div>
            
          ))
        ) : (
          <p className="text-gray-500 text-sm">Нямаш приятели</p>
        )}
        
      </div>

<Dialog open={!!friendToRemove} onOpenChange={() => setFriendToRemove(null)}>
  <DialogContent className="bg-gray-900 text-white text-center">
    <DialogHeader>
      <DialogTitle className="flex items-center justify-center gap-2">
        ⚠️ Are you sure?
      </DialogTitle>
    </DialogHeader>

    <p className="mt-2">
      Do you really want to remove{" "}
      <span className="font-bold">{friendToRemove?.name}</span> from your
      friends?
    </p>
    <p className="text-sm text-gray-400 mt-1">
      This action cannot be undone. All chat history will be deleted, but they will remain visible in your reviews.
    </p>

    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => setFriendToRemove(null)}
        className="px-5 py-2 rounded bg-gray-600 hover:bg-gray-500"
      >
        Cancel
      </button>
      <button
        onClick={handleRemoveFriend}
        className="px-5 py-2 rounded bg-red-600 hover:bg-red-500"
      >
        Remove
      </button>
    </div>
  </DialogContent>
</Dialog>

      

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Добави приятел</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Търси по никнейм..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="space-y-2">
  {results.length > 0 ? (
    results.map((f) => {
      const isAlreadyFriend = friends.some((fr) => fr.id === f.id);

      return (
        <div
          key={f.id}
          className="flex items-center justify-between p-2 bg-gray-800 rounded"
        >
          {f.image ? (
            <img
              src={f.image}
              alt={f.name || "User"}
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm">{f?.name?.[0] || "?"}</span>
            </div>
          )}

          <span className="ml-3">{f.name || "Unnamed"}</span>

          <button
            onClick={() => handleAddFriend(f.id)}
            disabled={isAlreadyFriend}
            className={`px-3 py-1 rounded transition ${
              isAlreadyFriend
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {isAlreadyFriend ? "Добавен" : "Добави"}
          </button>
        </div>
      );
    })
  ) : (
    <p className="text-gray-500 text-sm">Няма резултати</p>
  )}
</div>

        </DialogContent>
      </Dialog>

      <div className="absolute bottom-0 left-0 right-0 bg-black py-2 flex justify-around items-center shadow-lg">
        <button
          onClick={() => router.push("/friends")}
          className="flex flex-col items-center flex-1 text-blue-500"
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
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
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
