"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Hint } from "@prisma/client";

interface HintBoxProps {
  hints: Hint[];
}

export default function HintBox({ hints }: HintBoxProps) {
  const t = useTranslations("lesson");
  const [revealed, setRevealed] = useState(0);

  if (hints.length === 0) return null;

  const sorted = [...hints].sort((a, b) => a.order - b.order);

  return (
    <div className="mt-4 border border-yellow-200 rounded-xl bg-yellow-50 p-4">
      <div className="space-y-2 mb-3">
        {sorted.slice(0, revealed).map((h) => (
          <p key={h.id} className="text-sm text-yellow-800">
            💡 {h.text}
          </p>
        ))}
      </div>

      {revealed < sorted.length && (
        <button
          onClick={() => setRevealed((r) => r + 1)}
          className="text-sm text-yellow-700 font-medium hover:text-yellow-900 underline"
        >
          {t("showHint")} ({revealed + 1}/{sorted.length})
        </button>
      )}
    </div>
  );
}
