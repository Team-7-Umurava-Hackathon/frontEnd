"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Re-read user whenever the route changes (e.g. after login redirect)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]); // ← re-runs on every page change

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const getAvatar = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-primary shadow-md">
      <Link href="/">
        <h1 className="text-xl font-bold text-white">AI Recruiter</h1>
      </Link>

     <div className="flex gap-4 items-center">

  {/* Desktop ONLY */}
  <div className="hidden md:flex gap-4 items-center">
    <Link href="/jobs">
      <button className="px-4 py-2 rounded-xl text-white font-medium bg-primary hover:opacity-70">
        Positions
      </button>
    </Link>

    {user && (
      <>
        <Link href="/dashboard">
          <button className="px-4 py-2 rounded-xl text-primary font-medium bg-white hover:opacity-80">
            Dashboard
          </button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center">
            {getAvatar()}
          </div>
          <span className="text-white text-sm font-medium">
            {user.name || user.email}
          </span>
        </div>
      </>
    )}
  </div>

  {/* Logout ALWAYS visible */}
  {user ? (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-xl text-primary font-medium bg-white hover:opacity-80 transition"
    >
      Logout
    </button>
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
