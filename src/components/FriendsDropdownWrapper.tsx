"use client";

import { useEffect, useState } from "react";
import FriendsDropdown from "./FriendsDropdown";

type Friend = {
  id: string;
  name: string;
  image?: string | null;
};

export default function FriendsDropdownWrapper() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("/api/friends");
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    };
    fetchFriends();
  }, []);

  return (
    <FriendsDropdown
      friends={friends}
      selectedFriends={selectedFriends}
      onChange={setSelectedFriends}
    />
  );
}
