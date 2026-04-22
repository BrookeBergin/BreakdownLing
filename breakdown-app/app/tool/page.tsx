"use client";

import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

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

  const formatOutput = (data: any) => {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return (
        <div>
          <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 16 }}>{parsed.title}</h1>
          <p><strong>Author:</strong> {parsed.author}</p>
          <p><strong>Date:</strong> {parsed.date}</p>
          <p><strong>Summary:</strong></p>
          <p>{parsed.summary}</p>
          <p><strong>Literature Review:</strong></p>
          <p style={{ fontStyle: 'italic' }}>{parsed.litReview}</p>
        </div>
      );
    } catch (err) {
      return <p>Error parsing output</p>;
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 40,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>Breakdown</h1>

      {/* How does it work button */}
      <Button 
        onClick={() => setOpenModal(true)}
        size="small"
        sx={{ marginBottom: 8 }}
      >
        How does it work?
      </Button>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>How does it work?</DialogTitle>
        <DialogContent>
          {/* Add your text here */}
        </DialogContent>
      </Dialog>

      {/* Upload button */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button
          component="span"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ 
            backgroundColor: '#1D2D44',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: 12
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          Upload Research Paper
        </Button>
      </label>

      {/* File name display */}
      {file && <p style={{ marginBottom: 8 }}>{file.name}</p>}

      {/* Upload handler button */}
      <Button
        onClick={handleUpload}
        disabled={!file}
        sx={{ marginBottom: 12 }}
      >
        Process
      </Button>

      {loading && <p>Processing...</p>}

      {/* Output box */}
      {output && (
        <div style={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 24,
          marginTop: 16
        }}>
          {formatOutput(output)}
        </div>
      )}
    </div>
  );
}