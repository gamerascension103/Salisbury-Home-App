"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserBadge } from "./UserBadge";

interface HeaderProps {
  userId: string;
  displayName: string;
  color: string;
  vacationMode: boolean;
  vacationStartedAt: number | null;
  vacationSetByName: string | null;
}

export function Header({
  userId,
  displayName,
  color,
  vacationMode,
}: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleVacationToggle() {
    await fetch("/api/vacation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !vacationMode }),
    });
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-[#c9c2d4]">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-fraunces text-[18px] font-[500] text-[#1a1424] hover:text-[#5b3a8f] transition-colors duration-150"
          style={{ fontVariationSettings: '"opsz" 72' }}
        >
          Salisbury Home
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/history"
            className="label-mono text-[#6b6378] hover:text-[#5b3a8f] transition-colors duration-150 text-[10px]"
          >
            History
          </Link>
          <Link
            href="/system"
            className="label-mono text-[#6b6378] hover:text-[#5b3a8f] transition-colors duration-150 text-[10px]"
          >
            System
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleVacationToggle}
          className="label-mono text-[10px] px-2.5 py-1 rounded-sm transition-all duration-150"
          style={
            vacationMode
              ? {
                  background:
                    "linear-gradient(135deg, var(--accent-deep), var(--ink))",
                  color: "#d4d0dc",
                }
              : { color: "#8a8599" }
          }
        >
          {vacationMode ? "AWAY" : "AT HOME"}
        </button>
        <UserBadge userId={userId} displayName={displayName} color={color} />
        <button
          onClick={handleLogout}
          className="label-mono text-[#6b6378] hover:text-[#5b3a8f] transition-colors duration-150 text-[10px]"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
