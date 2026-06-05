"use client";

import { useEffect, useRef, useCallback } from "react";
import type { WorkspaceSvg } from "blockly";

interface BlocklyWorkspaceProps {
  initialXml?: string;
  onXmlChange?: (xml: string) => void;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
}

export default function BlocklyWorkspace({
  initialXml,
  onXmlChange,
  onCodeChange,
  readOnly = false,
}: BlocklyWorkspaceProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);

  const getCode = useCallback((workspace: WorkspaceSvg): string => {
    // Dynamic import to avoid SSR issues
    const Blockly = (window as Window & { Blockly?: { JavaScript?: { workspaceToCode: (ws: WorkspaceSvg) => string } } }).Blockly;
    return Blockly?.JavaScript?.workspaceToCode(workspace) ?? "";
  }, []);

  useEffect(() => {
    if (!divRef.current || workspaceRef.current) return;

    let workspace: WorkspaceSvg;

    async function init() {
      const Blockly = (await import("blockly")).default;
      const { blocks } = await import("blockly/blocks");
      Blockly.common.defineBlocks(blocks);
      const { javascriptGenerator } = await import("blockly/javascript");
      const { FARSI_TOOLBOX } = await import("@/lib/blockly/toolbox");
      const { FARSI_BLOCKLY_MESSAGES } = await import("@/lib/blockly/farsi-messages");

      // Apply Farsi messages
      Object.assign(Blockly.Msg, FARSI_BLOCKLY_MESSAGES);

      // Expose Blockly + generator on window for getCode helper
      (window as Window & { Blockly?: unknown }).Blockly = {
        JavaScript: { workspaceToCode: (ws: WorkspaceSvg) => javascriptGenerator.workspaceToCode(ws) },
      };

      workspace = Blockly.inject(divRef.current!, {
        toolbox: FARSI_TOOLBOX,
        rtl: true,
        readOnly,
        scrollbars: true,
        trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
        grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
        theme: Blockly.Themes.Classic,
      });

      workspaceRef.current = workspace;

      if (initialXml) {
        try {
          const dom = Blockly.utils.xml.textToDom(initialXml);
          Blockly.Xml.domToWorkspace(dom, workspace);
        } catch {
          // empty workspace is fine
        }
      }

      workspace.addChangeListener(() => {
        const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        onXmlChange?.(xml);

        const code = javascriptGenerator.workspaceToCode(workspace);
        onCodeChange?.(code);
      });
    }

    init();

    return () => {
      workspaceRef.current?.dispose();
      workspaceRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={divRef}
      className="w-full h-full min-h-[400px] rounded-lg border border-gray-200"
    />
  );
}
