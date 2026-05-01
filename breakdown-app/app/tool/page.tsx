"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Tabs, Tab, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UNSTABLE_REVALIDATE_RENAME_ERROR } from "next/dist/lib/constants";

function makePaperKey(title: string) {
  return crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(title.toLowerCase().trim())
  ).then(buf =>
    Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  // const [paperId, setPaperId] = useState<string | null>(null);
  const [paperKey, setPaperKey] = useState<string | null>(null);
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('summary');

  const displayName =
  user?.user_metadata?.display_name ||
  user?.user_metadata?.name ||
  user?.email ||
  "anonymous";


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

  async function makePaperKey(title: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(title.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setApiError(null);

    const formData = new FormData();
    formData.append("file", file);

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

    const parsed =
      typeof data.output === "string"
        ? JSON.parse(data.output)
        : data.output;

    setPaperKey(data.paperKey);
    setOutput(parsed);
    setLoading(false);
  }

  async function loadComments(paperKey: string) {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("paper_id", paperKey)
      .order("created_at", { ascending: true });

    setComments(data || []);
  }

  async function addComment() {
    if (!commentText || !paperKey || !user?.email) return;

    const text = commentText.trim();
    if (!text) return;

    const tempId = crypto.randomUUID();

    const newComment = {
      id: tempId,
      paper_key: paperKey,
      display_name: displayName,
      content: text,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText("");

    const { error } = await supabase.from("comments").insert({
      paper_key: paperKey,
      display_name: displayName,
      content: text,
    });
    if (error) {
      console.log("COMMENT ERROR:", error.message, error.details, error.hint);

      // rollback optimistic update
      setComments((prev) => prev.filter(c => c.id !== newComment.id));
    }
  }

  useEffect(() => {
      if (!paperKey) return;
      loadComments(paperKey);
    }, [paperKey]);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.dispatchEvent(new Event("open-login"));
      } else {
        setUser(data.user);
      }

      setLoadingUser(false);
    }

    checkUser();
  }, []);


  if (loadingUser) {
        return <p>Loading...</p>;
      }


  function highlightText(
    text: string,
    vocab: Array<{ term: string; definition: string }>
  ) {
    if (!text) return text;

    // escape regex chars
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // sort longest first (prevents "memory" matching inside "working memory")
    const sortedVocab = [...vocab].sort(
      (a, b) => b.term.length - a.term.length
    );

    let result: (string | JSX.Element)[] = [text];

    sortedVocab.forEach(({ term, definition }) => {
      const escaped = escapeRegex(term);

      // match full phrase with word boundaries on edges
      const regex = new RegExp(`(^|\\W)(${escaped})(?=\\W|$)`, "gi");

      result = result.flatMap((part) => {
        if (typeof part !== "string") return [part];

        const pieces: (string | JSX.Element)[] = [];
        let lastIndex = 0;

        part.replace(regex, (match, before, matchedTerm, offset) => {
          // push text before match
          pieces.push(part.slice(lastIndex, offset + before.length));

          // push highlighted term
          pieces.push(
            <span
              key={matchedTerm + offset}
              style={{
                backgroundColor: "#fff3cd",
                borderBottom: "1px dotted #333",
                cursor: "help",
              }}
              title={definition}
            >
              {matchedTerm}
            </span>
          );

          lastIndex = offset + before.length + matchedTerm.length;
          return match;
        });

        // push remaining text
        pieces.push(part.slice(lastIndex));

        return pieces;
      });
    });

    return result;
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
          {`Upload a linguistics research paper in PDF format. Our system will analyze the paper and provide you with a detailed breakdown, including a summary, literature review, research questions, methodology, participants, findings, key vocabulary, and potential applications. You can also join the discussion by leaving comments on the paper's page. It's designed to help you quickly understand and engage with academic research!`}
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
          // onClick={() => document.getElementById('file-input')?.click()}
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
          const vocabEntries = normalizeVocabulary(parsed);
          // const paperKey = makePaperKey(parsed.title);

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
                  <Tab label="Applications" value="applications" />
                </Tabs>
                <Box sx={{ flexGrow: 1, p: 3 }}>
                  {selectedTab === 'summary' && <p>{highlightText(parsed.summary, vocabEntries)}</p>}
                  {selectedTab === 'litReview' && <p>{highlightText(parsed.litReview, vocabEntries)}</p>}
                  {selectedTab === 'researchQuestions' && <p>{highlightText(parsed.researchQuestions, vocabEntries)}</p>}
                  {selectedTab === 'methodology' && <p>{highlightText(parsed.methodology, vocabEntries)}</p>}
                  {selectedTab === 'participants' && <p>{highlightText(parsed.participants, vocabEntries)}</p>}
                  {selectedTab === 'findings' && <p>{highlightText(parsed.findings, vocabEntries)}</p>}
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
                  {selectedTab === 'applications' && <p>{highlightText(parsed.applications, vocabEntries)}</p>}
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
                      {c.display_name || "anonymous"}
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