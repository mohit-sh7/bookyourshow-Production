import React, { useState } from "react";
import { User, Lock, Trash2, LogOut, Edit3 } from "lucide-react";

export default function Profile() {
  const [name, setName] = useState("Mohit Sharma");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);

    // Call your API here
    // await axios.put("/api/user/update", { name })
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmed) return;

    // Call your delete API here
    // await axios.delete("/api/user/delete");
  };

  return (
    <div className="min-h-screen px-6 py-32">
      <div className="mx-auto max-w-3xl rounded-2xl border border-purple-500/20 bg-[#13051F] p-8 shadow-xl">

        <div className="flex flex-col items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-600 text-4xl font-bold">
            M
          </div>

          <h1 className="mt-5 text-3xl font-bold">Profile Settings</h1>

          <p className="mt-2 text-gray-400">
            Manage your account information.
          </p>
        </div>

        <div className="mt-10 space-y-6">

          <div className="rounded-xl border border-white/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Name</h2>
            </div>

            {editing ? (
              <div className="flex gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-black/30 p-3 outline-none"
                />

                <button
                  onClick={handleSave}
                  className="rounded-lg bg-purple-600 px-5 py-3"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p>{name}</p>

                <button
                  onClick={() => setEditing(true)}
                  className="rounded-lg bg-purple-600 p-2"
                >
                  <Edit3 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Password</h2>
            </div>

            <button className="rounded-lg bg-blue-600 px-5 py-3">
              Change Password
            </button>
          </div>

          <div className="rounded-xl border border-red-500/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-red-500">
                Danger Zone
              </h2>
            </div>

            <p className="mb-4 text-gray-400">
              Deleting your account is permanent.
            </p>

            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-5 py-3"
            >
              Delete Account
            </button>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-gray-700 px-5 py-3">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}