"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { X } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const registerResponse = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await registerResponse.json();

    if (!registerResponse.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    const loginResponse = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (!loginResponse?.ok) {
      router.replace("/login");
      return;
    }

    router.replace("/");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white relative">
      
      <Link
        href="/"
        className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition"
      >
        <X size={20} />
      </Link>
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg w-96 space-y-6 border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center">
          Create Account <span className="inline-block">🚀</span>
        </h1>
        <p className="text-sm text-gray-400 text-center">
          Sign up to get started
        </p>

        <div className="space-y-4">
          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 focus-within:ring-2 focus-within:ring-blue-600">
            <User className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-transparent outline-none flex-1 text-white placeholder-gray-500"
            />
          </div>

          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 focus-within:ring-2 focus-within:ring-blue-600">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-transparent outline-none flex-1 text-white placeholder-gray-500"
            />
          </div>

          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 bg-gray-800 focus-within:ring-2 focus-within:ring-blue-600">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-transparent outline-none flex-1 text-white placeholder-gray-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition"
        >
          Sign Up
        </button>

        <p
          onClick={() => router.push("/login")}
          className="text-sm text-gray-400 text-center cursor-pointer hover:underline"
        >
          Already have an account? Log in
        </p>
      </form>
    </div>
    </div>
  );
}
