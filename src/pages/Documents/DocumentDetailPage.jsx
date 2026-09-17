import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService.js";
import { BASE_URL } from "../../utils/apiPaths.js";

import Spinner from "../../components/common/Spinner.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import Tabs from "../../components/common/Tabs.jsx";

import ChatInterface from "../../components/chat/ChatInterface.jsx";
import AiActions from "../../components/ai/AiActions.jsx";
import FlashcardManager from "../../components/flashcarrds/FlashcardManager.jsx";
import QuizManager from "../../components/quizzes/QuizManager.jsx";

// =========================================================
// DOCUMENT DETAIL PAGE
// =========================================================

const DocumentDetailPage = () => {
  // =========================================================
  // GET DOCUMENT ID FROM URL
  // =========================================================

  const { id } = useParams();

  // =========================================================
  // STATE
  // =========================================================

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  // =========================================================
  // FETCH DOCUMENT DETAILS
  // =========================================================

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      if (!id) {
        setDocument(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await documentService.getDocumentById(id);

        console.log("=================================");
        console.log("DOCUMENT DETAIL RESPONSE");
        console.log("=================================");
        console.log(response);

        // =====================================================
        // HANDLE DIFFERENT RESPONSE STRUCTURES
        // =====================================================

        const documentData = response?.data ?? response;

        console.log("DOCUMENT DATA:", documentData);
        console.log("FILE PATH:", documentData?.filePath);
        console.log("FILE NAME:", documentData?.fileName);

        if (!documentData) {
          throw new Error("Document data was not returned by the server.");
        }

        setDocument(documentData);
      } catch (error) {
        console.error("DOCUMENT DETAIL ERROR:", error);

        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Failed to fetch document details.",
        );

        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // =========================================================
  // BUILD PDF URL
  // =========================================================

  const getPdfUrl = () => {
    if (!document?.filePath) {
      console.error("PDF URL ERROR: filePath is missing.");
      return null;
    }

    // =======================================================
    // GET FILE PATH FROM DATABASE
    // =======================================================

    let filePath = String(document.filePath).trim();

    // =======================================================
    // NORMALIZE WINDOWS BACKSLASHES
    // =======================================================

    filePath = filePath.replace(/\\/g, "/");

    // =======================================================
    // IF BACKEND RETURNS COMPLETE URL
    // =======================================================

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    // =======================================================
    // REMOVE LEADING SLASHES
    // =======================================================

    filePath = filePath.replace(/^\/+/, "");

    // =======================================================
    // PREVENT DUPLICATE /uploads
    // =======================================================

    if (filePath.startsWith("uploads/")) {
      filePath = filePath.substring("uploads/".length);
    }

    // =======================================================
    // BUILD FINAL PDF URL
    // =======================================================

    const pdfUrl = `${BASE_URL}/uploads/${filePath}`;

    console.log("=================================");
    console.log("PDF URL DEBUG");
    console.log("=================================");
    console.log("Database filePath:", document.filePath);
    console.log("Normalized path:", filePath);
    console.log("Final PDF URL:", pdfUrl);
    console.log("=================================");

    return pdfUrl;
  };

  // =========================================================
  // CONTENT TAB
  // =========================================================

  const renderContent = () => {
    const pdfUrl = getPdfUrl();

    // =======================================================
    // PDF URL NOT AVAILABLE
    // =======================================================

    if (!pdfUrl) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <FileText className="h-7 w-7 text-slate-400" strokeWidth={2} />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              PDF Not Available
            </h3>

            <p className="text-sm text-slate-500">
              The PDF file path is missing from this document.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="document-viewer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* =====================================================
            VIEWER HEADER
        ===================================================== */}

        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* =================================================
                PDF ICON
            ================================================= */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/20">
              <FileText className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>

            {/* =================================================
                FILE INFORMATION
            ================================================= */}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {document.fileName || "Document.pdf"}
              </p>

              <p className="text-xs text-slate-500">PDF Document</p>
            </div>
          </div>

          {/* ===================================================
              OPEN IN NEW TAB
          =================================================== */}

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
          >
            <ExternalLink size={16} strokeWidth={2.2} />

            <span className="hidden sm:inline">Open in new tab</span>
          </a>
        </div>

        {/* =====================================================
            PDF VIEWER
        ===================================================== */}

        <div className="bg-slate-100 p-2 h-full">
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    );
  };

  // =========================================================
  // CHAT TAB
  // =========================================================

  const renderChat = () => {
    return <ChatInterface documentId={id} />;
  };

  // =========================================================
  // AI ACTIONS TAB
  // =========================================================

  const renderAIActions = () => {
    return <AiActions documentId={id} />;
  };

  // =========================================================
  // FLASHCARDS TAB
  // =========================================================

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />;
  };

  // =========================================================
  // QUIZZES TAB
  // =========================================================

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />;
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // =========================================================
  // DOCUMENT NOT FOUND
  // =========================================================

  if (!document) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            Document not found
          </h2>

          <p className="mb-5 text-sm text-slate-500">
            The document may have been deleted or does not exist.
          </p>

          <Link
            to="/documents"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-teal-600"
          >
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // TABS
  // =========================================================

  const tabs = [
    {
      name: "Content",
      label: "Content",
      content: renderContent(),
    },
    {
      name: "Chat",
      label: "Chat",
      content: renderChat(),
    },
    {
      name: "AI Actions",
      label: "AI Actions",
      content: renderAIActions(),
    },
    {
      name: "Flashcards",
      label: "Flashcards",
      content: renderFlashcardsTab(),
    },
    {
      name: "Quizzes",
      label: "Quizzes",
      content: renderQuizzesTab(),
    },
  ];

  // =========================================================
  // PAGE UI
  // =========================================================

  return (
    <div className="relative">
      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        title={document.title || "Untitled Document"}
        subtitle={document.fileName || "Learning document"}
      />

      {/* =====================================================
          DOCUMENT TABS
      ===================================================== */}

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* =====================================================
          PDF VIEWER ANIMATION
      ===================================================== */}

      <style>{`
        .document-viewer {
          animation: documentViewerEnter 0.55s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes documentViewerEnter {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .document-pdf-frame {
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .document-pdf-frame:focus {
          outline: none;
          border-color: rgb(16, 185, 129);
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .document-viewer {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentDetailPage;
