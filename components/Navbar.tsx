"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-primary shadow-md">
      <Link href="/">
        <h1 className="text-xl font-bold text-white">AI Recruiter</h1>
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/jobs">
          <button className="px-4 py-2 rounded-xl text-white font-medium bg-primary hover:opacity-70">
            Positions
          </button>
        </Link>

        {user ? (
          <>
            <Link href="/dashboard">
              <button className="px-4 py-2 rounded-xl text-primary font-medium bg-white hover:opacity-80">
                Dashboard
              </button>
            </Link>

            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center">
                {user.avatar}
              </div>
              <span className="text-white text-sm font-medium hidden md:block">
                {user.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-primary font-medium bg-white hover:opacity-80 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="px-4 py-2 rounded-xl text-white font-medium bg-primary hover:opacity-70 border border-white">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}