import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import quizService from "../../services/quizService.js";

import PageHeader from "../../components/common/PageHeader.jsx";
import Spinner from "../../components/common/Spinner.jsx";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

// =========================================================
// QUIZ RESULT PAGE
// =========================================================

const QuizResultPage = () => {
  // =========================================================
  // ROUTER + STATE
  // =========================================================

  const { quizId } = useParams();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH RESULTS
  // =========================================================

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const response = await quizService.getQuizResults(quizId);

        console.log("QUIZ RESULTS RESPONSE:", response);

        setResults(response);
      } catch (error) {
        console.error("FETCH RESULTS ERROR:", error);

        toast.error(error?.message || "Failed to fetch quiz results.");

        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchResults();
    }
  }, [quizId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // =========================================================
  // GET RESPONSE DATA
  // =========================================================

  const responseData = results?.data ?? results;

  if (!responseData?.quiz || !Array.isArray(responseData?.results)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const quiz = responseData.quiz;
  const detailedResults = responseData.results;

  // =========================================================
  // CALCULATE STATS
  // =========================================================

  const totalQuestions = detailedResults.length;

  const correctAnswers = detailedResults.filter(
    (result) => result.isCorrect,
  ).length;

  const incorrectAnswers = totalQuestions - correctAnswers;

  // CALCULATE SCORE IF BACKEND DOES NOT PROVIDE IT
  const score =
    typeof quiz.score === "number"
      ? quiz.score
      : totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

  // =========================================================
  // SCORE COLOR
  // =========================================================

  const getScoreColor = (currentScore) => {
    if (currentScore >= 80) {
      return "from-emerald-500 to-teal-500";
    }

    if (currentScore >= 60) {
      return "from-amber-500 to-orange-500";
    }

    return "from-rose-500 to-red-500";
  };

  // =========================================================
  // SCORE MESSAGE
  // =========================================================

  const getScoreMessage = (currentScore) => {
    if (currentScore >= 90) {
      return "Outstanding!";
    }

    if (currentScore >= 80) {
      return "Great job!";
    }

    if (currentScore >= 70) {
      return "Great work!";
    }

    if (currentScore >= 60) {
      return "Not bad!";
    }

    return "Keep practicing!";
  };

  // =========================================================
  // GET OPTION INDEX
  // =========================================================

  const getAnswerIndex = (answer, options = []) => {
    if (typeof answer === "number") {
      return answer;
    }

    if (typeof answer === "string") {
      // IF BACKEND SENDS 0, 1, 2, 3
      if (/^\d+$/.test(answer)) {
        return Number(answer);
      }

      // IF BACKEND SENDS A, B, C, D
      if (/^[A-Da-d]$/.test(answer)) {
        return answer.toUpperCase().charCodeAt(0) - 65;
      }

      // IF BACKEND SENDS 01, 02, 03, 04
      if (/^0\d+$/.test(answer)) {
        return Number(answer.substring(1)) - 1;
      }

      // IF BACKEND SENDS THE ACTUAL OPTION TEXT
      return options.findIndex((option) => option === answer);
    }

    return -1;
  };

  // =========================================================
  // PAGE UI
  // =========================================================

  return (
    <div className="mx-auto max-w-5xl">
      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document?._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-emerald-600"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            strokeWidth={2}
          />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      {/* =====================================================
          SCORE CARD
      ===================================================== */}

      <div className="mb-8 rounded-2xl border-2 border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="space-y-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/25">
            <Trophy className="h-7 w-7 text-emerald-600" strokeWidth={2} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
              Your Score
            </p>

            <div
              className={`mb-2 inline-block bg-linear-to-r ${getScoreColor(
                score,
              )} bg-clip-text text-5xl font-bold text-transparent`}
            >
              {score}%
            </div>

            <p className="text-lg font-medium text-slate-700">
              {getScoreMessage(score)}
            </p>
          </div>

          {/* STATS */}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
              <Target className="h-4 w-4 text-slate-600" strokeWidth={2} />

              <span className="text-sm font-semibold text-slate-700">
                {totalQuestions} Total
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
              <CheckCircle2
                className="h-4 w-4 text-emerald-600"
                strokeWidth={2}
              />

              <span className="text-sm font-semibold text-emerald-700">
                {correctAnswers} Correct
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2">
              <XCircle className="h-4 w-4 text-rose-600" strokeWidth={2} />

              <span className="text-sm font-semibold text-rose-700">
                {incorrectAnswers} Incorrect
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          QUESTION REVIEW
      ===================================================== */}

      <div className="space-y-6">
        <div className="mb-2 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-slate-600" strokeWidth={2} />

          <h3 className="text-lg font-semibold text-slate-900">
            Detailed Review
          </h3>
        </div>

        {detailedResults.map((result, index) => {
          const options = result.options || [];

          const userAnswerIndex = getAnswerIndex(
            result.selectedAnswer,
            options,
          );

          const correctAnswerIndex = getAnswerIndex(
            result.correctAnswer,
            options,
          );

          const isCorrect = Boolean(result.isCorrect);

          return (
            <div
              key={index}
              className="rounded-2xl border-2 border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1">
                    <span className="text-xs font-semibold text-slate-600">
                      Question {index + 1}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold leading-relaxed text-slate-900">
                    {result.question}
                  </h4>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isCorrect
                      ? "border-2 border-emerald-200 bg-emerald-50"
                      : "border-2 border-rose-200 bg-rose-50"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2
                      className="h-5 w-5 text-emerald-600"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <XCircle
                      className="h-5 w-5 text-rose-600"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </div>

              {/* OPTIONS */}

              <div className="mb-4 space-y-3">
                {options.map((option, optionIndex) => {
                  const isCorrectOption = optionIndex === correctAnswerIndex;

                  const isUserAnswer = optionIndex === userAnswerIndex;

                  const isWrongAnswer = isUserAnswer && !isCorrect;

                  return (
                    <div
                      key={optionIndex}
                      className={`relative rounded-lg border-2 px-4 py-3 transition-all duration-200 ${
                        isCorrectOption
                          ? "border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                          : isWrongAnswer
                            ? "border-rose-300 bg-rose-50"
                            : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium ${
                            isCorrectOption
                              ? "text-emerald-900"
                              : isWrongAnswer
                                ? "text-rose-900"
                                : "text-slate-700"
                          }`}
                        >
                          {option}
                        </span>

                        <div className="flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2
                                className="h-3 w-3"
                                strokeWidth={2.5}
                              />
                              Correct
                            </span>
                          )}

                          {isWrongAnswer && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                              <XCircle className="h-3 w-3" strokeWidth={2.5} />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EXPLANATION */}

              {result.explanation && (
                <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                      <BookOpen
                        className="h-4 w-4 text-slate-600"
                        strokeWidth={2}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Explanation
                      </p>

                      <p className="text-sm leading-relaxed text-slate-700">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =====================================================
          ACTION BUTTON
      ===================================================== */}

      <div className="mt-8 flex justify-center">
        <Link
          to={`/documents/${quiz.document?._id}`}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
              strokeWidth={2.5}
            />
            Return to Document
          </span>

          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;
