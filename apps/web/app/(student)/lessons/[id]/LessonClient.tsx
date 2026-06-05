"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type { CodeRunnerHandle } from "@/components/blockly/CodeRunner";
import type { MazeHandle, MazeConfig } from "@/components/maze/MazeView";
import { MAZE_TOOLBOX } from "@/lib/blockly/maze-toolbox";
import { registerMazeBlocks, registerMazeGenerators } from "@/lib/blockly/maze-blocks";
import HintBox from "@/components/curriculum/HintBox";
import type { Hint, Lesson, Progress } from "@prisma/client";
import { useTranslations } from "next-intl";

const BlocklyWorkspace = dynamic(() => import("@/components/blockly/BlocklyWorkspace"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center text-gray-400">
      در حال بارگذاری ویرایشگر...
    </div>
  ),
});

const CodeRunner = dynamic(() => import("@/components/blockly/CodeRunner"), { ssr: false });
const MazeView = dynamic(() => import("@/components/maze/MazeView"), { ssr: false });

interface LessonClientProps {
  lesson: Lesson & { hints: Hint[] };
  initialProgress: Progress | null;
  instructionsHtml: string;
  mazeConfig: MazeConfig | null;
}

export default function LessonClient({
  lesson,
  initialProgress,
  instructionsHtml,
  mazeConfig,
}: LessonClientProps) {
  const t = useTranslations("lesson");
  const runnerRef = useRef<CodeRunnerHandle>(null);
  const mazeRef = useRef<MazeHandle>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [currentXml, setCurrentXml] = useState(lesson.starterXml ?? "");
  const [completed, setCompleted] = useState(initialProgress?.completed ?? false);
  const [saving, setSaving] = useState(false);

  // Synchronously register maze blocks so they're ready before Blockly.inject()
  const handleBlocklyInit = useCallback(
    (Blockly: Record<string, unknown>, generator: Record<string, unknown>) => {
      if (!mazeConfig) return;
      registerMazeBlocks(Blockly as never);
      registerMazeGenerators(generator as never);
    },
    [mazeConfig]
  );

  const handleRun = useCallback(async () => {
    if (mazeConfig) {
      mazeRef.current?.run(currentCode);
    } else {
      runnerRef.current?.run(currentCode);
    }

    setSaving(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, savedXml: currentXml }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompleted(data.completed);
      }
    } finally {
      setSaving(false);
    }
  }, [currentCode, currentXml, lesson.id, mazeConfig]);

  const handleReset = useCallback(() => {
    if (mazeConfig) {
      mazeRef.current?.reset();
    } else {
      runnerRef.current?.clear();
    }
  }, [mazeConfig]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
      {/* Left panel: instructions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-4">{lesson.title}</h1>

        {completed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-green-700 font-medium text-sm">
            ✓ {t("completedMessage")}
          </div>
        )}

        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: instructionsHtml }}
        />

        <HintBox hints={lesson.hints} />
      </div>

      {/* Right panel: editor + output/maze */}
      <div className="flex flex-col gap-4">
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-600">{t("workspace")}</span>
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={saving}
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
              >
                ▶ {t("runCode")}
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
              >
                ↺ {t("resetCode")}
              </button>
            </div>
          </div>
          <div className="h-[calc(100%-3rem)]">
            <BlocklyWorkspace
              initialXml={initialProgress?.savedXml ?? lesson.starterXml ?? undefined}
              onXmlChange={setCurrentXml}
              onCodeChange={setCurrentCode}
              toolbox={mazeConfig ? MAZE_TOOLBOX : undefined}
              onBlocklyInit={handleBlocklyInit}
            />
          </div>
        </div>

        <div className="h-64 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-600">
              {mazeConfig ? "🗺️ ماز" : "خروجی"}
            </span>
          </div>
          <div className="h-[calc(100%-2.5rem)]">
            {mazeConfig ? (
              <MazeView ref={mazeRef} config={mazeConfig} />
            ) : (
              <CodeRunner ref={runnerRef} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
