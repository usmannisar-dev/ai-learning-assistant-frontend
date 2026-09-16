import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null || Number.isNaN(Number(bytes))) {
    return "N/A";
  }

  if (Number(bytes) === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];

  let size = Number(bytes);
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!document?._id) {
      return;
    }

    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();

    if (onDelete) {
      onDelete(document);
    }
  };

  const fileSize =
    document?.fileSize !== undefined
      ? formatFileSize(document.fileSize)
      : "N/A";

  const flashcardCount = document?.flashcardCount ?? 0;

  const quizCount = document?.quizCount ?? 0;

  return (
    <div
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/50"
      onClick={handleNavigate}
    >
      {/* Content */}
      <div>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-110">
            <FileText className="h-6 w-6 text-white" strokeWidth={2} />
          </div>

          <button
            type="button"
            aria-label={`Delete ${document?.title || "document"}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Title */}
        <h3
          className="mb-2 truncate text-base font-semibold text-slate-900"
          title={document?.title || "Untitled Document"}
        >
          {document?.title || "Untitled Document"}
        </h3>

        {/* File info */}
        <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="font-medium">{fileSize}</span>

          {document?.fileName && (
            <>
              <span>•</span>

              <span className="max-w-45 truncate" title={document.fileName}>
                {document.fileName}
              </span>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1.5">
            <BookOpen className="h-3.5 w-3.5 text-purple-600" strokeWidth={2} />

            <span className="text-xs font-semibold text-purple-700">
              {flashcardCount} Flashcards
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5">
            <BrainCircuit
              className="h-3.5 w-3.5 text-emerald-700"
              strokeWidth={2}
            />

            <span className="text-xs font-semibold text-emerald-700">
              {quizCount} Quizzes
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" strokeWidth={2} />

          <span>
            Uploaded{" "}
            {document?.createdAt
              ? moment(document.createdAt).fromNow()
              : "recently"}
          </span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 to-teal-500/0 transition-all duration-300 group-hover:from-emerald-500/5 group-hover:to-teal-500/5" />
    </div>
  );
};

export default DocumentCard;
