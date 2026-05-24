"use client";

import { useState, ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SectionCardProps {
  number: string;
  title: string;
  meta?: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
}

export function SectionCard({
  number,
  title,
  meta,
  children,
  defaultCollapsed = false,
}: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="w-full text-left grid grid-cols-[auto_1fr_auto] gap-3 items-center px-5 py-4 border-b border-dashed border-[#c9c2d4] hover:bg-[#ebe8f0] transition-colors duration-150"
      >
        <span className="label-mono text-[#5b3a8f] text-[11px]">{number}</span>
        <span
          className="font-fraunces text-[18px] font-[500] text-[#1a1424]"
          style={{ fontVariationSettings: '"opsz" 72' }}
        >
          {title}
        </span>
        <span className="flex items-center gap-2">
          {meta && (
            <span className="label-mono-xs text-[#6b6378] hidden sm:inline">
              {meta}
            </span>
          )}
          {collapsed ? (
            <ChevronRight size={16} strokeWidth={1.5} className="text-[#6b6378]" />
          ) : (
            <ChevronDown size={16} strokeWidth={1.5} className="text-[#6b6378]" />
          )}
        </span>
      </button>

      {!collapsed && <div className="py-2">{children}</div>}
    </div>
  );
}
