"use client";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import NextImage from "next/image";
import { getCroppedImg } from "@/lib/cropImage";

type Props = {
  user: {
    name?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    image?: string | null;
  };
};

export default function EditProfileDialog({ user }: Props) {
  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [image, setImage] = useState<string | null>(user?.image || null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropDone = async () => {
    if (!tempImage || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(tempImage, croppedAreaPixels);
    setImage(cropped);
    setShowCropper(false);
  };

  const handleSave = async () => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, firstName, lastName, image }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Something went wrong");
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl w-full max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 mb-4 group">
          {image ? (
            <NextImage
              src={image}
              alt="Profile"
              width={112}
              height={112}
              className="rounded-full border-4 border-gray-700 object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-700 border-4 border-gray-800 flex items-center justify-center text-4xl font-bold">
              {username?.[0] || "?"}
            </div>
          )}

          <label
            htmlFor="profile-upload"
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
          >
            <span className="text-white text-sm">Change</span>
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {showCropper && tempImage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-xl">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
              <button
                onClick={handleCropDone}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <input
          className="w-full mt-2 p-2 rounded bg-gray-800 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="w-full mt-2 p-2 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <div className="flex gap-2 mt-2 w-full">
          <input
            className="flex-1 p-2 rounded bg-gray-800 text-white"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            className="flex-1 p-2 rounded bg-gray-800 text-white"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
