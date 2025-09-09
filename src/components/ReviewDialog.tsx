"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import FriendsDropdownWrapper from "./FriendsDropdownWrapper";

<FriendsDropdownWrapper />


type ReviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  onSave: (data: { rating: number; comment: string; friends: string[] }) => void;
};

export default function ReviewDialog({
  isOpen,
  onClose,
  placeName,
  onSave,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [friends, setFriends] = useState<string[]>([]); 

  const handleSave = () => {
    onSave({ rating, comment, friends });
    setRating(0);
    setComment("");
    setFriends([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Добави ревю за <span className="text-blue-400">{placeName}</span></DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <p className="mb-2 text-sm text-gray-400">Star rating:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition ${
                    rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-400">Comments:</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Напиши мнение..."
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 resize-none h-28"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-400">Friends:</p>
            <FriendsDropdownWrapper />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
