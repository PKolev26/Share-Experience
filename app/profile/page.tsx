"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [showEditProfile, setShowEditProfile] = useState(false);

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

        <h1 className="text-xl font-semibold">
          {user?.name || "Unknown User"}
        </h1>
        <p className="text-gray-400">{user?.email || "No email"}</p>

        <div className="flex gap-3 mt-6 w-full">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition font-medium"
            onClick={() => setShowEditProfile(true)}
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700 rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400">Username</label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
