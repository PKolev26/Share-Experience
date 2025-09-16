"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md flex flex-col items-center">
        
        <div className="relative w-28 h-28 mb-4">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={112}
              height={112}
              className="rounded-full border-4 border-gray-700 object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-700 border-4 border-gray-800 flex items-center justify-center text-4xl font-bold">
              {user?.name?.[0] || "?"}
            </div>
          )}
        </div>

        <h1 className="text-xl font-semibold">{user?.name || "Unknown User"}</h1>
        <p className="text-gray-400">{user?.email || "No email"}</p>

        <div className="flex gap-3 mt-6 w-full">
          <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium">
            Edit Profile
          </button>
          <button
            onClick={() => { signOut({callbackUrl: "/login"}); }}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
