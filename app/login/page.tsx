"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<"jake" | "hannah" | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: selectedUser, password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Wrong password. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div
          className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm card-shadow overflow-hidden"
        >
          <div className="shimmer-bar" />
          <div className="px-8 pt-10 pb-10">
            <h1
              className="font-fraunces text-h2 text-[#1a1424] mb-1"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Salisbury Home
            </h1>
            <p className="label-mono text-[#6b6378] mb-8">
              House system
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="label-mono text-[#6b6378] mb-3">
                  Who are you?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUser("jake")}
                    className={[
                      "py-3 px-4 border text-[14px] font-[500] font-[Inter_Tight,sans-serif] transition-colors duration-150",
                      "rounded-sm",
                      selectedUser === "jake"
                        ? "bg-[#5b3a8f] border-[#5b3a8f] text-[#f6f4f9]"
                        : "bg-transparent border-[#c9c2d4] text-[#3a2f4a] hover:border-[#5b3a8f] hover:text-[#5b3a8f]",
                    ].join(" ")}
                  >
                    Jake
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUser("hannah")}
                    className={[
                      "py-3 px-4 border text-[14px] font-[500] font-[Inter_Tight,sans-serif] transition-colors duration-150",
                      "rounded-sm",
                      selectedUser === "hannah"
                        ? "bg-[#8a8599] border-[#8a8599] text-[#f6f4f9]"
                        : "bg-transparent border-[#c9c2d4] text-[#3a2f4a] hover:border-[#8a8599] hover:text-[#8a8599]",
                    ].join(" ")}
                  >
                    Hannah
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="label-mono text-[#6b6378] block mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={[
                    "w-full px-3 py-2.5 bg-[#ebe8f0] border text-[#1a1424] text-[15px]",
                    "focus:outline-none focus:border-[#5b3a8f]",
                    "transition-colors duration-150 rounded-sm",
                    "font-[Inter_Tight,sans-serif]",
                    error ? "border-[#5b3a8f]" : "border-[#c9c2d4]",
                  ].join(" ")}
                  placeholder="Household password"
                />
                {error && (
                  <p className="mt-2 text-[13px] text-[#5b3a8f] font-[Inter_Tight,sans-serif]">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!selectedUser || loading}
                className={[
                  "w-full py-3 px-6 text-[14px] font-[500] font-[Inter_Tight,sans-serif]",
                  "bg-[#5b3a8f] text-[#f6f4f9] border-0 rounded-sm",
                  "transition-colors duration-150",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:bg-[#3d2466]",
                ].join(" ")}
              >
                {loading ? "Signing in…" : "Enter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
