"use client";

import { useRef, useImperativeHandle, forwardRef, useCallback } from "react";

export interface CodeRunnerHandle {
  run: (code: string) => void;
  clear: () => void;
}

const SANDBOX_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: monospace; font-size: 14px; padding: 8px; margin: 0; background: #1e1e1e; color: #d4d4d4; }
  .output-line { margin: 2px 0; }
  .output-error { color: #f44747; }
</style>
</head>
<body>
<div id="output"></div>
<script>
  const output = document.getElementById('output');

  function print(value) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = String(value);
    output.appendChild(line);
  }

  window.addEventListener('message', function(e) {
    if (e.data.type !== 'run') return;
    output.innerHTML = '';
    try {
      const fn = new Function('print', e.data.code);
      fn(print);
    } catch(err) {
      const line = document.createElement('div');
      line.className = 'output-line output-error';
      line.textContent = 'خطا: ' + err.message;
      output.appendChild(line);
    }
  });
<\/script>
</body>
</html>`;

const SANDBOX_SRC = `data:text/html;charset=utf-8,${encodeURIComponent(SANDBOX_HTML)}`;

const CodeRunner = forwardRef<CodeRunnerHandle>((_, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const run = useCallback((code: string) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "run", code }, "*");
  }, []);

  const clear = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: "run", code: "" }, "*");
  }, []);

  useImperativeHandle(ref, () => ({ run, clear }));

  return (
    <iframe
      ref={iframeRef}
      src={SANDBOX_SRC}
      sandbox="allow-scripts"
      className="w-full h-full min-h-[200px] rounded-lg border border-gray-200 bg-[#1e1e1e]"
      title="نتیجه اجرای کد"
    />
  );
});

CodeRunner.displayName = "CodeRunner";

export default CodeRunner;
