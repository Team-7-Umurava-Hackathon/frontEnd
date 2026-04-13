"use client";

import { getUser } from "@/lib/auth";

export default function SettingsPage() {
  const user = getUser();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details.</p>
      </div>

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center">
            {user?.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.role}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Full Name</label>
            <input defaultValue={user?.name} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <input defaultValue={user?.email} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Role</label>
            <input defaultValue={user?.role} disabled className="w-full border rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>
        </div>

        <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}