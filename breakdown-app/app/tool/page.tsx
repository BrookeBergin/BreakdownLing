"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/process-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setOutput(data.output || "No output");
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>PDF → GPT</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload
      </button>

      {loading && <p>Processing...</p>}

      <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {output}
      </pre>
    </div>
  );
}