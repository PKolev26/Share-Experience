"use client";

import { useEffect, useState } from "react";
import { Home, FileText, Users, Newspaper, Star, User, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/ui/Footer";

type FeedItem = {
  id: string;
  rating: number;
  comment: string;
  placeName: string;
  createdAt: string;
  user: { id: string; name: string; image?: string | null };
};

export default function FeedPage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeed = async () => {
      const res = await fetch("/api/feed");
      if (res.ok) {
        setFeed(await res.json());
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-950 text-white flex flex-col">

      <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Feed</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {feed.length > 0 ? (
          feed.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800 shadow"
            >
              <div className="flex items-center gap-3 mb-2">
  {post.user?.image ? (
    <img
      src={post.user.image}
      alt={post.user.name}
      className="w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm">{post.user?.name?.[0] || "?"}</span>
    </div>
  )}
  <div>
    <p className="font-medium">{post.user?.name ?? "Unknown"}</p>
    <span className="text-xs text-gray-400">
      {new Date(post.createdAt).toLocaleDateString("bg-BG", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </span>
  </div>
</div>


              <h3 className="text-blue-400 font-semibold">{post.placeName}</h3>

              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      post.rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }
                  />
                ))}
              </div>

              <p className="text-sm mt-2 text-gray-300">{post.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center mt-8">
            Все още няма споделени ревюта от приятели
          </p>
        )}
      </div>

      <Footer>
      </Footer>
    </div>
  );
}
