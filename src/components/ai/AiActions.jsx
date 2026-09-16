import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

import aiService from "../../services/aiService.js";
import MarkDownRenderer from "../common/MarkDownRenderer.jsx";
import Modal from "../common/Modal.jsx";

const AiActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  // =========================================================
  // GENERATE DOCUMENT SUMMARY
  // =========================================================
  const handleGenerateSummary = async () => {
    if (!documentId) {
      toast.error("Document ID is missing.");
      return;
    }

    setLoadingAction("summary");

    try {
      const response = await aiService.generateSummary(documentId);

      console.log("GENERATE SUMMARY RESPONSE:", response);

      // SUPPORT DIFFERENT POSSIBLE API RESPONSE SHAPES
      const data = response?.data ?? response;

      const summary =
        data?.summary || data?.message || "No summary was generated.";

      setModalTitle("Document Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error("GENERATE SUMMARY ERROR:", error);

      toast.error(error?.message || "Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  // =========================================================
  // EXPLAIN CONCEPT
  // =========================================================
  const handleExplainConcept = async (event) => {
    event.preventDefault();

    const trimmedConcept = concept.trim();

    if (!trimmedConcept) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    if (!documentId) {
      toast.error("Document ID is missing.");
      return;
    }

    setLoadingAction("explain");

    try {
      const response = await aiService.explainConcept(
        documentId,
        trimmedConcept,
      );

      console.log("EXPLAIN CONCEPT RESPONSE:", response);

      // SUPPORT DIFFERENT POSSIBLE API RESPONSE SHAPES
      const data = response?.data ?? response;

      const explanation =
        data?.explanation || data?.message || "No explanation was generated.";

      setModalTitle(`Explanation of ${trimmedConcept}`);
      setModalContent(explanation);
      setIsModalOpen(true);

      setConcept("");
    } catch (error) {
      console.error("EXPLAIN CONCEPT ERROR:", error);

      toast.error(error?.message || "Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      {/* =========================================================
          AI ACTIONS CONTAINER
      ========================================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        {/* =======================================================
            HEADER
        ======================================================= */}
        <div className="border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50 px-6 py-5">
          <div className="flex items-center gap-3">
            {/* AI ICON */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2} />
            </div>

            {/* HEADER TEXT */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Assistant
              </h3>

              <p className="text-xs text-slate-500">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        {/* =======================================================
            ACTIONS
        ======================================================= */}
        <div className="space-y-6 p-6">
          {/* =====================================================
              GENERATE SUMMARY
          ===================================================== */}
          <div className="group rounded-xl border border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white p-5 transition-all duration-200 hover:border-slate-300/60 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              {/* DESCRIPTION */}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-100 to-cyan-100">
                    <BookOpen
                      className="h-4 w-4 text-blue-600"
                      strokeWidth={2}
                    />
                  </div>

                  <h4 className="font-semibold text-slate-900">
                    Generate Summary
                  </h4>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  Get a concise summary of the entire document.
                </p>
              </div>

              {/* SUMMARY BUTTON */}
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="shrink-0 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-teal-600 hover:to-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating...
                  </span>
                ) : (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          {/* =====================================================
              EXPLAIN CONCEPT
          ===================================================== */}
          <div className="rounded-xl border border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white p-5 transition-all duration-200 hover:border-slate-300/60 hover:shadow-md">
            <form onSubmit={handleExplainConcept}>
              {/* TITLE */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-100 to-orange-100">
                  <Lightbulb
                    className="h-4 w-4 text-amber-600"
                    strokeWidth={2}
                  />
                </div>

                <h4 className="font-semibold text-slate-900">
                  Explain a Concept
                </h4>
              </div>

              {/* DESCRIPTION */}
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                Enter a topic or concept from the document to get a detailed
                explanation.
              </p>

              {/* INPUT + BUTTON */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={concept}
                  onChange={(event) => setConcept(event.target.value)}
                  placeholder="e.g. React Hooks"
                  disabled={loadingAction === "explain"}
                  className="h-11 min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={loadingAction === "explain" || !concept.trim()}
                  className="shrink-0 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                >
                  {loadingAction === "explain" ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Explaining...
                    </span>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* =========================================================
          RESULT MODAL
      ========================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <MarkDownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AiActions;
