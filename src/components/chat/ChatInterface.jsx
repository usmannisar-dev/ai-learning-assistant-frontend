import { useEffect, useRef, useState } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import aiService from "../../services/aiService.js";
import { useAuth } from "../../context/useAuth.js";
import Spinner from "../common/Spinner.jsx";
import MarkDownRenderer from "../common/MarkDownRenderer.jsx";

const ChatInterface = ({ documentId: documentIdProp }) => {
  const { user } = useAuth();

  const messagesEndRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const documentId = documentIdProp;

  // =========================================================
  // SCROLL TO BOTTOM
  // =========================================================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =========================================================
  // FETCH CHAT HISTORY
  // =========================================================
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!documentId) {
        setHistory([]);
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);

        const response = await aiService.getChatHistory(documentId);

        console.log("CHAT HISTORY RESPONSE:", response);

        const data = response?.data ?? response;

        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("FETCH CHAT HISTORY ERROR:", error);

        toast.error(error?.message || "Failed to load chat history.");

        setHistory([]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  // =========================================================
  // AUTO SCROLL
  // =========================================================
  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading || !documentId) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedMessage,
      timestamp: new Date(),
    };

    // Show user's message immediately
    setHistory((previousHistory) => [...previousHistory, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, trimmedMessage);

      console.log("CHAT RESPONSE:", response);

      const data = response?.data ?? response;

      const assistantMessage = {
        role: "assistant",
        content:
          data?.answer || data?.message || "I couldn't generate an answer.",
        timestamp: new Date(),
        relevantChunks: data?.relevantChunks ?? [],
      };

      setHistory((previousHistory) => [...previousHistory, assistantMessage]);
    } catch (error) {
      console.error("CHAT ERROR:", error);

      const errorMessage = {
        role: "assistant",
        content:
          error?.message || "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setHistory((previousHistory) => [...previousHistory, errorMessage]);

      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RENDER MESSAGE
  // =========================================================
  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={`${msg.timestamp || index}-${index}`}
        className={`my-4 flex items-start gap-3 ${isUser ? "justify-end" : ""}`}
      >
        {/* AI AVATAR */}
        {!isUser && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
        )}

        {/* MESSAGE */}
        <div
          className={`max-w-2xl rounded-2xl p-4 shadow-sm ${
            isUser
              ? "rounded-br-md bg-linear-to-br from-emerald-500 to-teal-500 text-white"
              : "rounded-bl-md border border-slate-200/60 bg-white text-slate-800"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-slate">
              <MarkDownRenderer content={msg.content} />
            </div>
          )}
        </div>

        {/* USER AVATAR */}
        {isUser && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-200 to-slate-300 text-sm font-semibold text-slate-700 shadow-sm">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================
  if (initialLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100">
          <MessageSquare className="h-7 w-7 text-emerald-600" strokeWidth={2} />
        </div>

        <Spinner />

        <p className="mt-3 text-sm font-medium text-slate-500">
          Loading chat history...
        </p>
      </div>
    );
  }

  // =========================================================
  // MAIN CHAT
  // =========================================================
  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
      {/* =====================================================
          MESSAGE AREA
      ====================================================== */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-linear-to-br from-slate-50/50 via-white/50 to-slate-50/50 p-6">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/10">
              <MessageSquare
                className="h-8 w-8 text-emerald-600"
                strokeWidth={2}
              />
            </div>

            <h3 className="mb-2 text-base font-semibold text-slate-900">
              Start a conversation
            </h3>

            <p className="text-sm text-slate-500">
              Ask me anything about this document!
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        {/* AI TYPING INDICATOR */}
        {loading && (
          <div className="my-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
            </div>

            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200/60 bg-white px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "0ms" }}
                />

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "150ms" }}
                />

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* =====================================================
          INPUT AREA
      ====================================================== */}
      <div className="border-t border-slate-200/60 bg-white/80 p-5">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="h-12 min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
