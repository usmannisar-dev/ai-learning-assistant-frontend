import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  // =========================================================
  // DO NOT RENDER WHEN CLOSED
  // =========================================================
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* =====================================================
          CENTER MODAL
      ===================================================== */}
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        {/* ===================================================
            BACKDROP
        =================================================== */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* ===================================================
            MODAL CONTENT
        =================================================== */}
        <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur-xl">
          {/* =================================================
              CLOSE BUTTON
          ================================================= */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>

          {/* =================================================
              MODAL TITLE
          ================================================= */}
          {title && (
            <div className="mb-6 pr-10">
              <h3
                id="modal-title"
                className="text-xl font-semibold tracking-tight text-slate-900"
              >
                {title}
              </h3>
            </div>
          )}

          {/* =================================================
              MODAL BODY
          ================================================= */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
