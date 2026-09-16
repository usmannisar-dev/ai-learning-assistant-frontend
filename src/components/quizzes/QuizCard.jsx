import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";

// =========================================================
// QUIZ CARD
// =========================================================

const QuizCard = ({ quiz, onDelete }) => {
  const questionCount = quiz?.questions?.length || 0;

  const hasResults =
    Array.isArray(quiz?.userAnswers) && quiz.userAnswers.length > 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white/80 p-4 backdrop-blur-xl transition-all duration-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10">
      {/* =====================================================
          DELETE BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onDelete?.(quiz);
        }}
        className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 opacity-0 transition-all duration-200 hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
        title="Delete Quiz"
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      </button>

      <div className="space-y-4">
        {/* ===================================================
            STATUS BADGE
        =================================================== */}

        <div className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold">
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1">
            <Award className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />

            <span className="text-emerald-700">
              Score:{" "}
              {typeof quiz?.score === "number"
                ? `${quiz.score}%`
                : "Not attempted"}
            </span>
          </div>
        </div>

        {/* ===================================================
            TITLE
        =================================================== */}

        <div>
          <h3
            className="mb-1 line-clamp-2 text-base font-semibold text-slate-900"
            title={quiz?.title}
          >
            {quiz?.title ||
              `Quiz - ${moment(quiz?.createdAt).format("MMM DD, YYYY")}`}
          </h3>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Created{" "}
            {quiz?.createdAt
              ? moment(quiz.createdAt).format("MMM DD, YYYY")
              : "Unknown"}
          </p>
        </div>

        {/* ===================================================
            QUIZ INFO
        =================================================== */}

        <div className="flex items-center gap-3 border-t border-slate-100 pt-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="text-sm font-semibold text-slate-700">
              {questionCount} {questionCount === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          ACTION BUTTON
      ===================================================== */}

      <div className="mt-4 border-t border-slate-100 pt-4">
        {hasResults ? (
          <Link to={`/quizzes/${quiz._id}/results`} className="block">
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200 active:scale-95"
            >
              <BarChart2 className="h-4 w-4" strokeWidth={2.5} />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`} className="block">
            <button
              type="button"
              className="group/btn relative h-11 w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="h-4 w-4" strokeWidth={2.5} />
                Start Quiz
              </span>

              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-full" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
