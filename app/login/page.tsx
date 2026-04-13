"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function PasswordInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pr-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      // For now, register is not implemented — dummy auth only supports login
      setError("Registration is not available. Use the demo credentials below.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 600);
  };

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-sans">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-primary text-center">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-sm text-gray-500 text-center mt-2">
          {mode === "login" ? "Login to continue" : "Register to get started"}
        </p>

        {/* Toggle */}
        <div className="flex mt-6 rounded-xl overflow-hidden border">
          <button
            onClick={() => handleModeSwitch("login")}
            className={`w-1/2 py-2 font-medium transition ${
              mode === "login" ? "bg-primary text-white" : "bg-lightBlue text-primary"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleModeSwitch("register")}
            className={`w-1/2 py-2 font-medium transition ${
              mode === "register" ? "bg-primary text-white" : "bg-lightBlue text-primary"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <PasswordInput placeholder="Password" value={password} onChange={setPassword} />

          {mode === "register" && (
            <PasswordInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </div>

        {/* Demo credentials hint */}
        {mode === "login" && (
          <p className="text-xs text-center text-gray-400 mt-3">
            Demo: <span className="font-medium text-gray-500">admin@umurava.com</span> /{" "}
            <span className="font-medium text-gray-500">password123</span>
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <p className="px-3 text-xs text-gray-400">OR</p>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full py-3 rounded-xl border flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C41.4 35.3 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}