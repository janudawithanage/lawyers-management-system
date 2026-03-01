/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS MESSAGES — Store-Connected Real-Time Chat UI
 * ══════════════════════════════════════════════════════════════
 *
 * Connected to globalStore case messaging system.
 * Shows conversations grouped by active cases.
 * Auto-reply simulation via addMessageToCase.
 */

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  User,
} from "lucide-react";
import useClientStore from "../hooks/useClientStore";
import EmptyState from "@components/common/EmptyState";

// ── Message Bubble ───────────────────────────────────────────

function MessageBubble({ message, isOwn }) {
  const time = new Date(message.timestamp).toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-gold-500/15 text-neutral-200 rounded-br-md border border-gold-500/15"
              : "bg-white/[0.04] text-neutral-300 rounded-bl-md border border-white/[0.06]"
          }`}
        >
          {message.text}
        </div>
        <div className={`flex items-center gap-1.5 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-neutral-600">{message.senderName}</span>
          <span className="text-[10px] text-neutral-700">•</span>
          <span className="text-[10px] text-neutral-600">{time}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Conversation Card ────────────────────────────────────────

function ConversationCard({ caseData, lastMessage, unread, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${
        isActive
          ? "bg-gold-500/8 border border-gold-500/15"
          : "hover:bg-white/[0.03] border border-transparent"
      }`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/10 shrink-0">
        <Briefcase className="w-4 h-4 text-gold-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-200 truncate">{caseData.title}</p>
          {lastMessage && (
            <span className="text-[10px] text-neutral-600 shrink-0 ml-2">
              {new Date(lastMessage.timestamp).toLocaleTimeString("en-LK", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 truncate">
          {lastMessage ? lastMessage.text : "No messages yet"}
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          {caseData.lawyerName} • {caseData.caseType}
        </p>
      </div>
      {unread > 0 && (
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-500 text-[10px] font-bold text-dark-900 shrink-0">
          {unread}
        </span>
      )}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN MESSAGES COMPONENT
// ══════════════════════════════════════════════════════════════

export default function Messages() {
  const { myCases, addMessageToCase } = useClientStore();
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  // Only cases with messages or active cases
  const conversations = useMemo(() => {
    return myCases
      .filter((c) => c.status !== "TERMINATED")
      .sort((a, b) => {
        const aLast = (a.messages || []).at(-1)?.timestamp || a.createdAt;
        const bLast = (b.messages || []).at(-1)?.timestamp || b.createdAt;
        return bLast - aLast;
      });
  }, [myCases]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.lawyerName.toLowerCase().includes(q) ||
        c.caseType.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const selectedCase = useMemo(
    () => conversations.find((c) => c.id === selectedCaseId),
    [conversations, selectedCaseId]
  );

  const messages = selectedCase?.messages || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Auto-select first if none
  useEffect(() => {
    if (!selectedCaseId && conversations.length > 0) {
      setSelectedCaseId(conversations[0].id);
    }
  }, [conversations, selectedCaseId]);

  const handleSend = useCallback(() => {
    if (!inputText.trim() || !selectedCaseId) return;
    addMessageToCase(selectedCaseId, inputText.trim(), "client");
    setInputText("");
  }, [inputText, selectedCaseId, addMessageToCase]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No Conversations"
        description="Conversations are automatically created when you have active cases with lawyers."
      />
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      {/* ── Sidebar: Conversations List ── */}
      <div className={`w-full sm:w-80 border-r border-white/[0.06] flex flex-col shrink-0 ${selectedCaseId ? "hidden sm:flex" : "flex"}`}>
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-neutral-100 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/30 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.map((c) => (
            <ConversationCard
              key={c.id}
              caseData={c}
              lastMessage={(c.messages || []).at(-1)}
              unread={0}
              isActive={selectedCaseId === c.id}
              onClick={() => setSelectedCaseId(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedCaseId ? "hidden sm:flex" : "flex"}`}>
        {selectedCase ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.01]">
              <button
                onClick={() => setSelectedCaseId(null)}
                className="sm:hidden p-1 rounded-lg hover:bg-white/[0.06]"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-400" />
              </button>
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold-500/10 shrink-0">
                <Briefcase className="w-4 h-4 text-gold-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-200 truncate">{selectedCase.title}</p>
                <p className="text-[11px] text-neutral-500">
                  {selectedCase.lawyerName} • {selectedCase.caseType}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessageSquare className="w-8 h-8 text-neutral-700 mb-2" />
                  <p className="text-sm text-neutral-600">Start a conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.sender === "client"}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/30 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="flex items-center justify-center w-10 h-10 rounded-xl gradient-gold-btn text-white disabled:opacity-30 transition-opacity shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageSquare className="w-10 h-10 text-neutral-700 mb-3" />
            <p className="text-sm text-neutral-500">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
