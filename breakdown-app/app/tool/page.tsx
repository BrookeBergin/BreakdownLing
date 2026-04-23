"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Tabs, Tab, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [paperId, setPaperId] = useState<string | null>(null);
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('summary');

  const normalizeVocabulary = (data: any): Array<{ term: string; definition: string }> => {
    const entries: Array<{ term: string; definition: string }> = [];
    const addEntry = (term: unknown, definition: unknown) => {
      const normalizedTerm = String(term || '').trim();
      const normalizedDefinition = String(definition || '').trim();
      if (normalizedTerm) {
        entries.push({ term: normalizedTerm, definition: normalizedDefinition });
      }
    };

    const parseCollection = (value: any) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === 'string') {
            addEntry(item, '');
          } else if (item && typeof item === 'object') {
            addEntry(item.word || item.term || item.text || item.name, item.definition || item.def || item.meaning || item.explanation || '');
          }
        });
        return;
      }
      if (typeof value === 'object') {
        Object.entries(value).forEach(([key, val]) => {
          addEntry(key, val);
        });
        return;
      }
      addEntry(value, '');
    };

    parseCollection(data.vocabulary);
    parseCollection(data.definitions);

    const deduped: Record<string, string> = {};
    entries.forEach((entry) => {
      const key = entry.term.toLowerCase();
      if (!deduped[key]) {
        deduped[key] = entry.definition;
      }
    });

    return Object.entries(deduped).map(([term, definition]) => ({ term, definition }));
  };

  async function handleUpload() {
    const id = crypto.randomUUID();
    setPaperId(id)

    if (!file) return;

    setLoading(true);
    setApiError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("paper_id", id);

    const res = await fetch("/api/process-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setApiError(data.error || "Failed to process file.");
      setOutput(null);
    } else if (!data.output) {
      setApiError("API returned no output.");
      setOutput(null);
    } else {
      setOutput(data.output);
    }

    setPaperId(paperId);
    setLoading(false);
  }

  async function loadComments(paperId: string) {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("paper_id", paperId)
      .order("created_at", { ascending: true });

    setComments(data || []);
  }

  async function addComment() {
    if (!commentText || !paperId || !user?.email) return;

    const newComment = {
      id: crypto.randomUUID(),
      paper_id: paperId,
      user_email: user.email,
      content: commentText,
      user_id: user?.id,
    };

    // optimistic UI
    setComments((prev) => [...prev, newComment]);
    setCommentText("");

    const { error } = await supabase.from("comments").insert({
      paper_id: paperId,
      user_email: user.email,
      content: newComment.content,
    });

    if (error) {
      console.log("COMMENT ERROR:", error.message, error.details, error.hint);

      // rollback optimistic update
      setComments((prev) => prev.filter(c => c.id !== newComment.id));
    }
  }

  // async function addComment() {
  // if (!commentText || !paperId) return;

  //   const newComment = {
  //     id: crypto.randomUUID(),
  //     paper_id: paperId,
  //     user_email: user?.email,
  //     content: commentText,
  //   };

  //   // 1. instantly update UI
  //   setComments((prev) => [...prev, newComment]);

  //   setCommentText("");

  //   // 2. persist to database
  //   const { error } = await supabase.from("comments").insert({
  //     paper_id: paperId,
  //     user_email: user?.email,
  //     content: newComment.content,
  //   });

  //   // 3. if DB fails, rollback by refetching
  //   if (error) {
  //     console.log("COMMENT ERROR:", error.message, error.details, error.hint);
  //       setComments((prev) => prev.filter(c => c.id !== newComment.id));

  //   }
  // }

  useEffect(() => {
    if (!output) return;

    try {
      const parsed =
        typeof output === "string" ? JSON.parse(output) : output;

      if (paperId) {
        loadComments(paperId);
      }
    } catch (e) {
      console.log("parse failed", e);
    }
  }, [output]);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login"); // or "/"
      } else {
        setUser(data.user);
      }

      setLoadingUser(false);
    }

    checkUser();
  }, []);

  useEffect(() => {
    if (!output) return;

    try {
      const parsed =
        typeof output === "string" ? JSON.parse(output) : output;

      if (paperId) {
        loadComments(paperId);
      }
    } catch (e) {
      console.log("parse failed", e);
    }
  }, [output]);

  if (loadingUser) {
        return <p>Loading...</p>;
      }

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
      {apiError ? (
        <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#ffe6e6', border: '1px solid #ffb3b3', borderRadius: 8, padding: 24, marginTop: 16 }}>
          <p style={{ margin: 0, color: '#a80000', fontWeight: 600 }}>Error: {apiError}</p>
        </div>
      ) : null}

      {output && (() => {
        try {
          const parsed = typeof output === 'string' ? JSON.parse(output) : output;

          return (
            <div>
            <div style={{
              width: '100%',
              maxWidth: '1000px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 24,
              marginTop: 16
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <h1 style={{ fontFamily: 'serif', fontWeight: 'bold' }}>{parsed.title}</h1>
                <p style={{ fontFamily: 'sans-serif', fontWeight: 'normal' }}>{parsed.author} ({parsed.date})</p>
              </div>
              <hr style={{ border: '1px solid lightgray', marginBottom: 16 }} />
              {/* Tabs and Content */}
              <div style={{ display: 'flex' }}>
                <Tabs
                  orientation="vertical"
                  value={selectedTab}
                  onChange={(event, newValue) => setSelectedTab(newValue)}
                  sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200 }}
                >
                  <Tab label="Summary" value="summary" />
                  <Tab label="Literature Review" value="litReview" />
                  <Tab label="Research Questions" value="researchQuestions" />
                  <Tab label="Methodology" value="methodology" />
                  <Tab label="Participants" value="participants" />
                  <Tab label="Findings" value="findings" />
                  <Tab label="Vocabulary" value="vocabulary" />
                </Tabs>
                <Box sx={{ flexGrow: 1, p: 3 }}>
                  {selectedTab === 'summary' && <p>{parsed.summary}</p>}
                  {selectedTab === 'litReview' && <p>{parsed.litReview}</p>}
                  {selectedTab === 'researchQuestions' && <p>{parsed.researchQuestions}</p>}
                  {selectedTab === 'methodology' && <p>{parsed.methodology}</p>}
                  {selectedTab === 'participants' && <p>{parsed.participants}</p>}
                  {selectedTab === 'findings' && <p>{parsed.findings}</p>}
                  {selectedTab === 'vocabulary' && (() => {
                    const vocabEntries = normalizeVocabulary(parsed);
                    return vocabEntries.length > 0 ? (
                      <div style={{ width: '100%', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd', padding: '12px' }}>Term</th>
                              <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd', padding: '12px' }}>Definition</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vocabEntries.map((entry) => (
                              <tr key={entry.term}>
                                <td style={{ borderBottom: '1px solid #eee', padding: '12px', verticalAlign: 'top', fontWeight: 600 }}>{entry.term}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '12px', verticalAlign: 'top' }}>{entry.definition || 'No definition available'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No vocabulary entries were found.</p>
                    );
                  })()}
                </Box>
              </div>
            </div>
            <div>
              <hr style={{ marginTop: 20 }} />

              <h3>Discussion</h3>

              {/* Comment input */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  style={{ flex: 1, padding: 8 }}
                />

                <Button
                  onClick={() => addComment()}
                  variant="contained"
                >
                  Post
                </Button>
              </div>

              {/* Comment list */}
              <div style={{ marginTop: 16 }}>
                {comments.map((c) => (
                  <div key={c.id} style={{ padding: 8, borderBottom: '1px solid #ddd' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {c.user_email || "anonymous"}
                    </p>
                    <p style={{ margin: 0 }}>{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          );
        } catch (err) {
          return <p>Unable to parse output. Please try another file or check API response format.</p>;
        }
        
      })()}

    </div>
  );
}