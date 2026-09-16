import { useState } from "react";
import { RotateCcw, Star } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // =========================================================
  // FLIP CARD
  // =========================================================
  const handleFlip = () => {
    setIsFlipped((previousState) => !previousState);
  };

  if (!flashcard) {
    return null;
  }

  return (
    <div
      className="relative h-72 w-full"
      style={{
        perspective: "1000px",
      }}
    >
      {/* =====================================================
          CARD INNER
      ===================================================== */}
      <div
        onClick={handleFlip}
        className="relative h-full w-full cursor-pointer transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===================================================
            FRONT - QUESTION
        =================================================== */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border-2 border-slate-200/60 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* =================================================
              TOP SECTION
          ================================================= */}
          <div className="flex items-center justify-between">
            {/* DIFFICULTY */}
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              {flashcard.difficulty || "Medium"}
            </span>

            {/* STAR BUTTON */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                if (onToggleStar) {
                  onToggleStar(flashcard._id);
                }
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-linear-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500"
              }`}
              aria-label={
                flashcard.isStarred ? "Unstar flashcard" : "Star flashcard"
              }
            >
              <Star
                className="h-4 w-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* =================================================
              QUESTION
          ================================================= */}
          <div className="flex flex-1 items-center justify-center px-4 py-6">
            <p className="text-center text-lg font-semibold leading-relaxed text-slate-900">
              {flashcard.question || "No question available."}
            </p>
          </div>

          {/* =================================================
              FLIP INDICATOR
          ================================================= */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />

            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* ===================================================
            BACK - ANSWER
        =================================================== */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border-2 border-emerald-400/60 bg-linear-to-br from-emerald-500 to-teal-500 p-8 shadow-xl shadow-emerald-500/30"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* =================================================
              STAR BUTTON
          ================================================= */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                if (onToggleStar) {
                  onToggleStar(flashcard._id);
                }
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                flashcard.isStarred
                  ? "border border-white/40 bg-white/30 text-white backdrop-blur-sm"
                  : "border border-white/20 bg-white/20 text-white/70 backdrop-blur-sm hover:bg-white/30 hover:text-white"
              }`}
              aria-label={
                flashcard.isStarred ? "Unstar flashcard" : "Star flashcard"
              }
            >
              <Star
                className="h-4 w-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* =================================================
              ANSWER
          ================================================= */}
          <div className="flex flex-1 items-center justify-center px-4 py-6">
            <p className="text-center text-base font-medium leading-relaxed text-white">
              {flashcard.answer || "No answer available."}
            </p>
          </div>

          {/* =================================================
              FLIP INDICATOR
          ================================================= */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-white/70">
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />

            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
