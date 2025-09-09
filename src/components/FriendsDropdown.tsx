"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { User } from "lucide-react";

type Friend = {
  id: string;
  name: string;
  image?: string | null;
};

type FriendsDropdownProps = {
  friends: Friend[];
  selectedFriends: Friend[];
  onChange: (friends: Friend[]) => void;
};

export default function FriendsDropdown({
  friends,
  selectedFriends,
  onChange,
}: FriendsDropdownProps) {
  const [open, setOpen] = useState(false);

  const toggleFriend = (friend: Friend) => {
    if (selectedFriends.some((f) => f.id === friend.id)) {
      onChange(selectedFriends.filter((f) => f.id !== friend.id));
    } else {
      onChange([...selectedFriends, friend]);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 flex items-center justify-between">
          {selectedFriends.length > 0 ? (
            <div className="flex -space-x-2">
              {selectedFriends.map((f) =>
                f.image ? (
                  <img
  key={f.id}
  src={f.image}
  alt={f.name}
  className="w-10 h-10 rounded-full object-cover border border-gray-600"
/>
                ) : (
                  <div
                    key={f.id}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 bg-gray-700"
                  >
                    <User size={20} className="text-gray-300" />
                  </div>
                )
              )}
            </div>
          ) : (
            <span className="text-gray-400">Избери приятели</span>
          )}
          <span className="ml-2">▼</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 text-white">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <DropdownMenuItem
              key={friend.id}
              onClick={() => toggleFriend(friend)}
              className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800"
            >
              {friend.image ? (
                <img
  src={friend.image}
  alt={friend.name}
  className="w-10 h-10 rounded-full object-cover border border-gray-600"
/>

              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 bg-gray-700">
                  <User size={18} className="text-gray-300" />
                </div>
              )}
              <span>{friend.name}</span>
              {selectedFriends.some((f) => f.id === friend.id) && (
                <span className="ml-auto text-green-400">✔</span>
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <p className="text-gray-400 px-3 py-2">Нямаш приятели</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
