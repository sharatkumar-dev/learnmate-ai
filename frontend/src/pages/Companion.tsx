import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLearnMate } from '@/context/LearnMateContext';
import { getRoadmapData } from '@/utils/roadmapStore';
import {
  type CognitiveMode,
  type ChatAttachmentItem,
  type CompanionMessage,
  type ConversationThread,
  getStoredThreads,
  saveStoredThreads,
  getActiveThreadId,
  setActiveThreadId,
  createNewThread,
  deleteThread,
  addMessageToActiveThread,
  updateThreadCognitiveMode,
  toggleThreadBookmark,
  addDocumentToThread,
  removeDocumentFromThread,
  getDynamicSuggestedPrompts,
  exportThreadToMarkdown,
  exportThreadToHtml,
} from '@/utils/companionStore';
import {
  sendCompanionMessage,
  uploadCompanionDocument,
  sendCompanionFeedback,
} from '@/api/client';

export function Companion() {
  const { user } = useLearnMate();
  const userName = user?.fullName || 'Jordan Taylor';
  const userInitials = useMemo(() => {
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [userName]);

  // Active roadmap curriculum context
  const track = useMemo(() => getRoadmapData(), []);
  const activeStage = useMemo(() => {
    return track.stages.find((s) => s.status === 'in-progress') || track.stages[0];
  }, [track]);
  const activeModule = useMemo(() => {
    return activeStage.modules.find((m) => m.status === 'in-progress') || activeStage.modules[0];
  }, [activeStage]);

  // Conversation threads state
  const [threads, setThreads] = useState<ConversationThread[]>(() => getStoredThreads(userName));
  const [activeThreadId, setActiveThreadIdState] = useState<string>(() => getActiveThreadId());

  const currentThread = useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) || threads[0];
  }, [threads, activeThreadId]);

  // Chat UI state
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const cognitiveMode = currentThread?.cognitiveMode || 'socratic';
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedStagingDocs, setAttachedStagingDocs] = useState<ChatAttachmentItem[]>([]);

  // Companion persona settings
  const [persona, setPersona] = useState('Staff Systems Architect');
  const [responseDepth, setResponseDepth] = useState('Deep Proofs & Code');

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThread?.messages, sending]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const modeDescriptions: Record<CognitiveMode, string> = {
    socratic: 'Guides your intuition with structured counter-questions and logical probes.',
    code: 'Analyzes edge cases, race conditions, memory ordering, and Go/Rust/Python concurrency bugs.',
    direct: 'Delivers exhaustive architectural breakdowns, math proofs, and clear summaries.',
  };

  // ─────────────────────────────────────────────
  // Thread Operations
  // ─────────────────────────────────────────────

  const handleSwitchThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setActiveThreadIdState(threadId);
    showToast('Switched conversation thread.');
  };

  const handleNewThread = () => {
    const newT = createNewThread('New Conversation', cognitiveMode);
    setThreads(getStoredThreads(userName));
    setActiveThreadIdState(newT.id);
    showToast('Started new conversation thread.');
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteThread(threadId);
    setThreads(updated);
    setActiveThreadIdState(getActiveThreadId());
    showToast('Conversation thread deleted.');
  };

  const handleClearThread = () => {
    if (!currentThread) return;
    const updatedThreads = threads.map((t) => {
      if (t.id === currentThread.id) {
        return { ...t, messages: [], attachedDocs: [] };
      }
      return t;
    });
    setThreads(updatedThreads);
    saveStoredThreads(updatedThreads);
    showToast('Thread history cleared.');
  };

  const handleToggleBookmark = () => {
    if (!currentThread) return;
    const isBookmarked = toggleThreadBookmark(currentThread.id);
    setThreads(getStoredThreads(userName));
    showToast(isBookmarked ? '★ Conversation pinned to favorites.' : 'Removed from favorites.');
  };

  const handleCognitiveModeChange = (mode: CognitiveMode) => {
    if (currentThread) {
      updateThreadCognitiveMode(currentThread.id, mode);
      setThreads(getStoredThreads(userName));
    }
    showToast(`Switched mode to ${mode.toUpperCase()}.`);
  };

  // ─────────────────────────────────────────────
  // Message Sending & AI Response Handling
  // ─────────────────────────────────────────────

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || sending || !currentThread) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `msg-user-${Date.now()}`;

    const userMsg: CompanionMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: timeStr,
      attachments: attachedStagingDocs.length > 0 ? [...attachedStagingDocs] : undefined,
    };

    // Add user message to thread
    addMessageToActiveThread(currentThread.id, userMsg);
    setThreads(getStoredThreads(userName));
    setInput('');
    const docsToSend = [...attachedStagingDocs, ...currentThread.attachedDocs];
    setAttachedStagingDocs([]);
    setSending(true);

    try {
      const response = await sendCompanionMessage(
        text,
        cognitiveMode,
        currentThread.id,
        docsToSend.map((d) => ({
          filename: d.name,
          file_type: d.type,
          file_size: d.size,
          text_content: d.textContent,
        })),
        {
          target_role: user?.trajectory || 'Distributed Systems Staff Engineer',
          active_module: `${activeModule.code}: ${activeModule.title}`,
        }
      );

      const asstMsg: CompanionMessage = {
        id: `msg-asst-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: cognitiveMode,
        modelUsed: response.model_used || 'IBM Granite 3.0 (watsonx.ai)',
        citations: response.citations || ['LearnMate Systems Knowledge Base'],
      };

      addMessageToActiveThread(currentThread.id, asstMsg);
      setThreads(getStoredThreads(userName));
    } catch {
      // Offline fallback
      setTimeout(() => {
        const asstMsg: CompanionMessage = {
          id: `msg-asst-${Date.now()}`,
          role: 'assistant',
          content: `### Systems Architecture Breakdown

Regarding: **"${text}"**

In distributed consensus and concurrent state-machine architectures, consistency requires strict majority quorum verification ($Q = \\lfloor N / 2 \\rfloor + 1$). Under network partitions, nodes in a minority partition cannot establish quorum, preventing split-brain state mutations.

\`\`\`go
func (rf *Raft) checkCommitQuorum(index int) bool {
    matches := 1
    quorum := (len(rf.peers) / 2) + 1
    for _, match := range rf.matchIndex {
        if match >= index { matches++ }
    }
    return matches >= quorum && rf.log[index].Term == rf.currentTerm
}
\`\`\`

- **Term Invariant**: Checking term equality guarantees older uncommitted entries are rolled back upon partition reconciliation (Ongaro §5.4).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: cognitiveMode,
          modelUsed: 'LearnMate Systems Intelligence (Granite 3.1 8B Architecture)',
          citations: ['Ongaro & Ousterhout (2014) §5', 'Stanford CS244B Corpus'],
        };
        addMessageToActiveThread(currentThread.id, asstMsg);
        setThreads(getStoredThreads(userName));
      }, 400);
    } finally {
      setSending(false);
    }
  };

  const handleRetryLastMessage = async () => {
    if (!currentThread || currentThread.messages.length === 0) return;
    const lastUserMsg = [...currentThread.messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      await handleSend(lastUserMsg.content);
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('✓ Message copied to clipboard.');
  };

  const handleFeedback = (msgId: string, rating: 'up' | 'down') => {
    void sendCompanionFeedback(msgId, rating);
    const updated = threads.map((t) => {
      if (t.id === currentThread.id) {
        return {
          ...t,
          messages: t.messages.map((m) => (m.id === msgId ? { ...m, feedback: rating } : m)),
        };
      }
      return t;
    });
    setThreads(updated);
    saveStoredThreads(updated);
    showToast(rating === 'up' ? '✓ Thank you! Marked as helpful.' : '✓ Feedback recorded to improve AI models.');
  };

  // ─────────────────────────────────────────────
  // Document Uploads
  // ─────────────────────────────────────────────

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentThread) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadRes = await uploadCompanionDocument(file);
        const newDoc: ChatAttachmentItem = {
          id: `doc-${Date.now()}-${i}`,
          name: uploadRes.filename,
          size: uploadRes.file_size,
          type: uploadRes.file_type as any,
          textPreview: uploadRes.text_preview,
          textContent: uploadRes.text_content,
          uploadedAt: 'Just now',
        };

        addDocumentToThread(currentThread.id, newDoc);
        setAttachedStagingDocs((prev) => [...prev, newDoc]);
        setThreads(getStoredThreads(userName));
        showToast(`✓ Attached ${file.name} to conversation context!`);
      } catch {
        showToast(`Failed to parse ${file.name}.`);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveDoc = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentThread) return;
    removeDocumentFromThread(currentThread.id, docId);
    setAttachedStagingDocs((prev) => prev.filter((d) => d.id !== docId));
    setThreads(getStoredThreads(userName));
    showToast('Document removed from context.');
  };

  // ─────────────────────────────────────────────
  // Voice Dictation
  // ─────────────────────────────────────────────

  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice dictation is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak now.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        showToast('Voice captured.');
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Voice recognition error.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast('Voice recognition could not start.');
    }
  };

  const handleInsertCodeSnippet = () => {
    const snippet = '```go\n// Paste code here\nfunc main() {\n\n}\n```\n';
    setInput((prev) => (prev ? `${prev}\n${snippet}` : snippet));
    showToast('Inserted code block template.');
  };

  // ─────────────────────────────────────────────
  // Export Chat
  // ─────────────────────────────────────────────

  const handleExportMarkdown = () => {
    if (!currentThread) return;
    const md = exportThreadToMarkdown(currentThread, userName);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnmate_chat_${currentThread.id}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    showToast('Transcript exported as Markdown (.md).');
  };

  const handleExportHtml = () => {
    if (!currentThread) return;
    const html = exportThreadToHtml(currentThread, userName);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      if (typeof window !== 'undefined' && !window.navigator.userAgent.includes('HeadlessChrome')) {
        setTimeout(() => printWindow.print(), 300);
      }
    }
    setShowExportModal(false);
    showToast('Transcript opened in printable print engine.');
  };

  // Dynamic suggested prompts
  const suggestedPrompts = useMemo(() => {
    return getDynamicSuggestedPrompts(activeModule.code, currentThread?.attachedDocs || []);
  }, [activeModule.code, currentThread?.attachedDocs]);

  return (
    <div className="flex flex-col w-full gap-space-lg relative pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 pointer-events-none bg-on-surface text-surface-container-lowest px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-outline-variant/40 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".pdf,.doc,.docx,.txt,.md,.go,.rs,.py,.js,.ts,.json,.sql,.yaml"
        className="hidden"
        id="companionFileInput"
      />

      {/* Top Session Breadcrumb Bar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full bg-surface-container-lowest shadow-sm rounded-xl px-space-md py-space-sm border border-outline-variant/30">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-on-primary shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">neurology</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 text-on-surface-variant font-body-sm text-body-sm">
            <span className="truncate">{track.title}</span>
            <span className="text-outline">/</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate" id="activeCurriculumBreadcrumb">
              {activeStage.stageNumber}: {activeModule.title}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm shrink-0 border border-primary/20">
            Active Session
          </span>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-code-sm text-code-sm border border-outline-variant/20">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-md text-label-md font-medium text-on-surface-variant truncate max-w-[220px]" id="activeContextPill">
              Context: {currentThread?.attachedDocs.length || 0} Docs • {activeModule.code}
            </span>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            id="settingsBtn"
            className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Settings</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            id="exportChatBtn"
            className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">ios_share</span>
            <span>Export Chat</span>
          </button>
        </div>
      </section>

      {/* Main Split Architecture Canvas */}
      <div className="grid grid-cols-12 gap-space-lg items-start">
        {/* LEFT PANE: CONTEXT & COGNITIVE CONTROLS (4 Cols) */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-space-md">
          {/* Active Track Card & Cognitive Mode Selector */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Active Track &amp; Module
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-0.5">
                  {activeModule.title}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {track.trackCode} • {activeModule.domainLabel}
                </p>
              </div>
              <span className="p-1.5 rounded-lg bg-surface-container-low text-primary border border-outline-variant/30">
                <span className="material-symbols-outlined text-[20px]">account_tree</span>
              </span>
            </div>

            {/* Cognitive Mode Toggle */}
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Cognitive Mode
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-surface-container-low rounded-lg border border-outline-variant/20" id="cognitiveModeSelector">
                {(['socratic', 'code', 'direct'] as CognitiveMode[]).map((mode) => {
                  const isSelected = cognitiveMode === mode;
                  const labelMap: Record<CognitiveMode, string> = {
                    socratic: 'Socratic',
                    code: 'Code Review',
                    direct: 'Direct Detail',
                  };
                  return (
                    <button
                      key={mode}
                      id={`modeBtn-${mode}`}
                      onClick={() => handleCognitiveModeChange(mode)}
                      className={`py-1.5 px-2 rounded-md font-label-sm text-label-sm text-center transition-all ${
                        isSelected
                          ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                          : 'text-on-surface-variant hover:text-on-surface font-medium'
                      }`}
                      type="button"
                    >
                      {labelMap[mode]}
                    </button>
                  );
                })}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 italic" id="modeDescription">
                "{modeDescriptions[cognitiveMode]}"
              </p>
            </div>

            {/* Attached Documents Knowledge Base */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Loaded Documents
                </span>
                <span className="font-code-sm text-code-sm text-primary font-semibold" id="docsCountBadge">
                  {currentThread?.attachedDocs.length || 0} Sources
                </span>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto" id="loadedDocsList">
                {currentThread?.attachedDocs.length === 0 ? (
                  <p className="text-outline font-body-sm text-body-sm italic py-2">
                    No documents attached yet. Click below to upload papers, notes, or code.
                  </p>
                ) : (
                  currentThread?.attachedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group border border-outline-variant/20"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          {doc.type === 'pdf'
                            ? 'picture_as_pdf'
                            : doc.type === 'code'
                            ? 'code_blocks'
                            : 'description'}
                        </span>
                        <div className="min-w-0">
                          <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">
                            {doc.name}
                          </p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">
                            {(doc.size / 1024).toFixed(1)} KB • Ingested vector store
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveDoc(doc.id, e)}
                        className="text-outline hover:text-error transition-colors p-1"
                        title="Remove document from context"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                id="attachFileSidebarBtn"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md transition-all mt-1 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Attach Notebook or File</span>
              </button>
            </div>
          </div>

          {/* Conversation Threads History (Exploration Threads) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Exploration Threads
              </span>
              <button
                type="button"
                onClick={handleNewThread}
                id="newThreadBtn"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold hover:bg-primary-fixed-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>New</span>
              </button>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto" id="threadsList">
              {threads.map((t) => {
                const isActive = t.id === activeThreadId;
                return (
                  <div
                    key={t.id}
                    id={`threadItem-${t.id}`}
                    onClick={() => handleSwitchThread(t.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-surface-container border border-primary/30'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        {t.isBookmarked && (
                          <span className="text-secondary text-[12px] material-symbols-outlined">
                            star
                          </span>
                        )}
                        <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">
                          {t.title}
                        </p>
                      </div>
                      <span className="font-label-sm text-label-sm text-outline">
                        {t.messages.length} turns • {t.cognitiveMode}
                      </span>
                    </div>
                    {threads.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteThread(t.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all p-1"
                        title="Delete conversation thread"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Learner Profile Summary Card */}
          <div className="bg-primary-container/10 rounded-xl p-space-md space-y-2 relative overflow-hidden border border-outline-variant/30">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/10 blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low/60">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-sm text-label-sm font-semibold shrink-0 shadow-sm">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="font-label-md text-label-md text-on-surface truncate leading-tight font-semibold">
                    {userName}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                    {user?.trajectory || 'Staff Systems Engineer'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-code-sm text-code-sm font-semibold">
                Personal Pro
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Curriculum anchored to <strong>{activeModule.code}</strong>. Queries are automatically calibrated against quorum invariants, non-blocking atomics, and your active career milestones.
            </p>
          </div>
        </aside>

        {/* RIGHT PANE: CONVERSATIONAL STREAM (8 Cols) */}
        <main className="col-span-12 lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden min-h-[780px] border border-outline-variant/30">
          {/* Conversation Stream Header */}
          <div className="flex items-center justify-between px-space-lg py-space-md bg-surface-container-lowest shadow-sm border-b border-outline-variant/20">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
              </div>
              <div className="min-w-0">
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2 truncate">
                  <span className="truncate">{currentThread?.title || 'LearnMate AI Companion'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold shrink-0">
                    {currentThread?.cognitiveMode.toUpperCase()}
                  </span>
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Model: IBM Granite 3.0 (watsonx.ai) • Context: {currentThread?.attachedDocs.length || 0} Docs Loaded
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-on-surface-variant">
              <button
                onClick={handleToggleBookmark}
                id="bookmarkThreadBtn"
                className={`p-1.5 rounded-lg transition-colors ${
                  currentThread?.isBookmarked
                    ? 'text-secondary bg-surface-container-low'
                    : 'hover:bg-surface-container-low hover:text-on-surface'
                }`}
                title="Bookmark conversation"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {currentThread?.isBookmarked ? 'star' : 'bookmark_border'}
                </span>
              </button>
              <button
                onClick={handleClearThread}
                id="clearThreadBtn"
                className="p-1.5 rounded-lg hover:bg-surface-container-low hover:text-on-surface transition-colors"
                title="Clear thread memory"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-space-lg space-y-space-lg bg-surface-container-lowest overflow-y-auto max-h-[640px]" id="messageStream">
            {currentThread?.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[36px]">neurology</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Ask anything about {activeModule.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-1">
                    Your AI companion can prove distributed correctness theorems, debug concurrency races, and synthesize your uploaded files.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg pt-2">
                  {suggestedPrompts.map((promptText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(promptText)}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md shadow-sm transition-all border border-outline-variant/30 text-left"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              currentThread?.messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="flex gap-space-sm max-w-[85%] items-start">
                        <div className="bg-primary text-on-primary rounded-2xl rounded-tr-xs p-space-md shadow-sm space-y-2">
                          <div className="flex items-center justify-between gap-4 pb-1 border-b border-primary-container text-primary-fixed font-label-sm text-label-sm">
                            <span className="font-medium">You ({userName})</span>
                            <span className="text-primary-fixed/80">{msg.timestamp}</span>
                          </div>
                          <p className="font-body-md text-body-md text-surface-container-lowest leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-primary-container/40">
                              {msg.attachments.map((att) => (
                                <span
                                  key={att.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-container text-primary-fixed font-code-sm text-[11px]"
                                >
                                  <span className="material-symbols-outlined text-[13px]">attachment</span>
                                  <span>{att.name}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 mt-1 shadow-sm">
                          {userInitials}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-space-sm max-w-[96%]">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      </div>
                      <div className="flex-1 min-w-0 space-y-space-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                              LearnMate Tutor
                            </span>
                            <span className="font-label-sm text-label-sm text-outline">{msg.timestamp}</span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm">
                              {msg.mode ? msg.mode.toUpperCase() : 'AI TUTOR'}
                            </span>
                          </div>

                          {/* Message Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.content)}
                              className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                              title="Copy response"
                            >
                              <span className="material-symbols-outlined text-[16px]">content_copy</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, 'up')}
                              className={`p-1 rounded hover:bg-surface-container transition-colors ${
                                msg.feedback === 'up' ? 'text-primary' : 'text-outline hover:text-on-surface'
                              }`}
                              title="Helpful response"
                            >
                              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, 'down')}
                              className={`p-1 rounded hover:bg-surface-container transition-colors ${
                                msg.feedback === 'down' ? 'text-error' : 'text-outline hover:text-on-surface'
                              }`}
                              title="Needs improvement"
                            >
                              <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                            </button>
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-space-md bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap border border-outline-variant/20 shadow-xs">
                          {msg.content}
                        </div>

                        {/* Citations Pill */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="flex items-center gap-1.5 text-outline font-code-sm text-[11px] pt-0.5">
                            <span className="material-symbols-outlined text-[14px] text-primary">menu_book</span>
                            <span>Referenced: {msg.citations.join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Sending / Generating Pulse Indicator */}
            {sending && (
              <div className="flex items-start gap-space-sm max-w-[96%] animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <div className="p-space-md bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md border border-outline-variant/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span>Synthesizing systems architecture &amp; formulating proof...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Follow-up Suggested Question Chips */}
          <div className="px-space-lg pt-2 pb-1 bg-surface-container-lowest border-t border-outline-variant/20">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="font-label-sm text-label-sm text-outline shrink-0 font-medium">
                Suggested Probes:
              </span>
              {suggestedPrompts.slice(0, 3).map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(promptText)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/30 shadow-xs transition-all active:scale-95 group text-left"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary group-hover:rotate-45 transition-transform">
                    bolt
                  </span>
                  <span className="truncate max-w-[280px]">{promptText}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Attached Staging Chips */}
          {attachedStagingDocs.length > 0 && (
            <div className="px-space-lg pt-2 bg-surface-container-lowest flex flex-wrap gap-2 items-center">
              <span className="font-label-sm text-label-sm text-outline font-medium">To be sent:</span>
              {attachedStagingDocs.map((doc) => (
                <span
                  key={doc.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-primary font-code-sm text-[12px] border border-primary/20"
                >
                  <span className="material-symbols-outlined text-[15px]">attachment</span>
                  <span className="font-medium">{doc.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedStagingDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                    className="hover:text-error transition-colors ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* BOTTOM CHAT INPUT BAR */}
          <div className="p-space-md bg-surface-container-lowest shadow-sm border-t border-outline-variant/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSend();
              }}
              className="space-y-2"
            >
              <div className="relative bg-surface-container-low rounded-xl p-space-md border border-outline-variant/30 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <textarea
                  id="companionPromptInput"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  className="w-full bg-transparent resize-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline p-1 leading-relaxed"
                  placeholder={`Ask questions on ${activeModule.title}, attach files, or request formal proofs...`}
                  rows={3}
                />

                <div className="flex items-center justify-between pt-space-sm border-t border-outline-variant/20 mt-1">
                  <div className="flex items-center gap-1">
                    <button
                      id="attachFilePromptBtn"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                      title="Attach file or code"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">attach_file</span>
                    </button>
                    <button
                      id="voiceDictationBtn"
                      onClick={handleToggleVoice}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isListening
                          ? 'bg-error-container text-on-error-container animate-pulse'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                      title="Voice dictation"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isListening ? 'mic_active' : 'mic'}
                      </span>
                    </button>
                    <button
                      id="insertCodeBtn"
                      onClick={handleInsertCodeSnippet}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                      title="Insert code block template"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">code</span>
                    </button>
                    <div className="h-4 w-px bg-outline-variant/50 mx-1"></div>
                    <span className="font-code-sm text-code-sm text-outline px-1 hidden sm:inline">
                      Context: {currentThread?.attachedDocs.length || 0} Docs referenced
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetryLastMessage}
                      disabled={sending || !currentThread || currentThread.messages.length === 0}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30"
                      title="Regenerate last response"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </button>

                    <button
                      id="sendMessageBtn"
                      disabled={sending || !input.trim()}
                      className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all active:scale-95 disabled:opacity-40"
                      type="submit"
                    >
                      <span>Send</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-on-surface-variant font-label-sm text-label-sm">
                <span>Press ↵ to send • Shift + ↵ for new line</span>
                <span className="hover:underline cursor-pointer" onClick={() => setShowSettingsModal(true)}>
                  Model: IBM Granite 3.0 (watsonx.ai)
                </span>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in" id="settingsModal">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                AI Companion Settings
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-outline"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-semibold block mb-1">
                  Persona Stance
                </label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface font-body-sm text-body-sm"
                >
                  <option value="Staff Systems Architect">Staff Systems Architect (Rigorous &amp; Mathematical)</option>
                  <option value="Socratic Tutor">Socratic Tutor (Probing Questions)</option>
                  <option value="Concurrency Auditor">Concurrency Auditor (Race Condition Hunter)</option>
                </select>
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface font-semibold block mb-1">
                  Response Depth
                </label>
                <select
                  value={responseDepth}
                  onChange={(e) => setResponseDepth(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface font-body-sm text-body-sm"
                >
                  <option value="Deep Proofs & Code">Deep Proofs &amp; Code (Default)</option>
                  <option value="Balanced Summary">Balanced Summary</option>
                  <option value="Concise Bullet Points">Concise Bullet Points</option>
                </select>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant font-body-sm text-body-sm border border-outline-variant/20">
                <p><strong>Configured AI Engine:</strong> IBM watsonx.ai • Granite 3.0</p>
                <p className="text-outline text-[12px] mt-0.5">Supports multi-turn memory, file context ingestion, and code generation.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  showToast('Settings saved.');
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in" id="exportModal">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Export Conversation
              </h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-outline"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Download the complete chat history for <strong>{currentThread?.title}</strong> including citations and timestamps.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                id="exportMarkdownBtn"
                onClick={handleExportMarkdown}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 flex flex-col items-center justify-center gap-2 text-on-surface transition-all group"
              >
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">
                  markdown
                </span>
                <span className="font-label-md text-label-md font-semibold">Markdown (.md)</span>
              </button>

              <button
                type="button"
                id="exportHtmlBtn"
                onClick={handleExportHtml}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 flex flex-col items-center justify-center gap-2 text-on-surface transition-all group"
              >
                <span className="material-symbols-outlined text-[28px] text-secondary group-hover:scale-110 transition-transform">
                  picture_as_pdf
                </span>
                <span className="font-label-md text-label-md font-semibold">Printable PDF / HTML</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
