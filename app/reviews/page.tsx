"use client";

import { useEffect, useState } from "react";
import { Search, Star, Home, Users, FileText, User, Newspaper, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Review = {
  id: string;
  rating: number;
  comment: string;
  placeName: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  isShared: boolean;
  friends: { friend: { id: string; name: string; image: string } }[];
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    };
    fetchReviews();
  }, []);

  const handleShare = async (id: string) => {
    const res = await fetch("/api/reviews/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isShared: true } : r
        )
      );
    }
  };

  const filtered = reviews.filter(
    (r) =>
      r.placeName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col text-white">
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center gap-2">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Търси в ревютата..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <div
              key={r.id}
              className="bg-gray-900 rounded-lg p-4 shadow border border-gray-800 relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-400">{r.placeName}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("bg-BG", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      r.rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }
                  />
                ))}
              </div>

              <p className="text-sm mt-2 text-gray-300">{r.comment}</p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-400">Бях с:</span>
                <div className="flex gap-2">
                  {r.friends.map(({ friend }) => (
                    <div key={friend.id} className="relative group">
                      {friend.image ? (
                        <img
                          src={friend.image}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm">{friend?.name?.[0] || "?"}</span>
            </div>
                      )}
                      <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {friend.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  disabled={r.isShared}
                  onClick={() => handleShare(r.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    r.isShared
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {r.isShared ? "Shared" : "Share"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center mt-8">
            Нямаш намерени ревюта
          </p>
        )}
      </div>

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
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <MessageCircle size={22} />
          <span className="text-xs">Chat</span>
        </button>

        <button
          onClick={() => router.push("/reviews")}
          className="flex flex-col items-center flex-1 text-blue-500"
        >
          <FileText size={22} />
          <span className="text-xs">Reviews</span>
        </button>
      </div>
    </div>
  );
}
