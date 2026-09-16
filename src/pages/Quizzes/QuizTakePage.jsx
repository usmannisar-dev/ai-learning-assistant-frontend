import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import quizService from "../../services/quizService.js";

import PageHeader from "../../components/common/PageHeader.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import Button from "../../components/common/Button.jsx";

import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

// =========================================================
// QUIZ TAKE PAGE
// =========================================================

const QuizTakePage = () => {
  // =========================================================
  // ROUTER
  // =========================================================

  const { quizId } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // FETCH QUIZ
  // =========================================================

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const response = await quizService.getQuizById(quizId);

        console.log("QUIZ RESPONSE:", response);

        setQuiz(response?.data ?? response);
      } catch (error) {
        console.error("FETCH QUIZ ERROR:", error);

        toast.error(error?.message || "Failed to fetch quiz.");

        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // =========================================================
  // SELECT ANSWER
  // =========================================================

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // =========================================================
  // SUBMIT QUIZ
  // =========================================================

  const handleSubmitQuiz = async () => {
    if (!quiz || !quiz.questions?.length) {
      toast.error("Quiz data is missing.");
      return;
    }

    // =======================================================
    // MAKE SURE ALL QUESTIONS ARE ANSWERED
    // =======================================================

    if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      // =====================================================
      // FORMAT ANSWERS
      // IMPORTANT:
      // SEND OPTION INDEX, NOT OPTION TEXT
      // =====================================================

      const formattedAnswers = quiz.questions.map((question, questionIndex) => {
        const selectedAnswer = Number(selectedAnswers[question._id]);

        return {
          questionIndex,
          selectedAnswer,
        };
      });

      // =====================================================
      // VALIDATE ANSWERS
      // =====================================================

      const hasInvalidAnswer = formattedAnswers.some(
        (answer) =>
          !Number.isInteger(answer.selectedAnswer) ||
          answer.selectedAnswer < 0 ||
          answer.selectedAnswer > 3,
      );

      if (hasInvalidAnswer) {
        console.error("INVALID ANSWERS:", formattedAnswers);

        toast.error("One or more answers are invalid.");
        return;
      }

      const response = await quizService.submitQuiz(quizId, formattedAnswers);

      // =====================================================
      // DEBUG BACKEND RESPONSE
      // =====================================================

      console.log("=================================");
      console.log("QUIZ SUBMIT SUCCESS");
      console.log("=================================");
      console.log("Submit response:", response);

      // =====================================================
      // SUCCESS
      // =====================================================

      toast.success("Quiz submitted successfully!");

      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to submit quiz.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
  // QUIZ NOT FOUND
  // =========================================================

  if (!quiz || !quiz.questions?.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">
            Quiz not found or has no questions.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const isAnswered = Object.prototype.hasOwnProperty.call(
    selectedAnswers,
    currentQuestion._id,
  );

  const answerCount = Object.keys(selectedAnswers).length;

  // =========================================================
  // PAGE UI
  // =========================================================

  return (
    <div>
      <PageHeader title={quiz.title || "Take Quiz"} />

      {/* =====================================================
          PROGRESS BAR
      ===================================================== */}

      <div className="mx-auto mb-8 max-w-4xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>

          <span className="text-sm font-medium text-slate-500">
            {answerCount} answered
          </span>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quiz.questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* =====================================================
          QUESTION CARD
      ===================================================== */}

      <div className="mx-auto mb-8 max-w-4xl rounded-2xl border-2 border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

          <span className="text-sm font-semibold text-emerald-700">
            Question {currentQuestionIndex + 1}
          </span>
        </div>

        <h3 className="mb-6 text-lg font-semibold leading-relaxed text-slate-900">
          {currentQuestion.question}
        </h3>

        {/* OPTIONS */}

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;

            return (
              <label
                key={index}
                className={`group relative flex cursor-pointer items-center rounded-xl border-2 p-3 transition-all duration-200 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-md"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="sr-only"
                />

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white group-hover:border-emerald-400"
                  }`}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>

                <span
                  className={`ml-4 text-sm font-medium transition-colors duration-200 ${
                    isSelected
                      ? "text-emerald-900"
                      : "text-slate-700 group-hover:text-slate-900"
                  }`}
                >
                  {option}
                </span>

                {isSelected && (
                  <CheckCircle2
                    className="ml-auto h-5 w-5 text-emerald-500"
                    strokeWidth={2.5}
                  />
                )}
              </label>
            );
          })}
        </div>

        {!isAnswered && (
          <p className="mt-4 text-xs text-slate-500">
            Select an answer before moving on.
          </p>
        )}
      </div>

      {/* =====================================================
          NAVIGATION BUTTONS
      ===================================================== */}

      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                Submit Quiz
              </>
            )}
          </button>
        ) : (
          <Button onClick={handleNextQuestion} disabled={submitting}>
            Next
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </Button>
        )}
      </div>

      {/* =====================================================
          QUESTION NAVIGATION DOTS
      ===================================================== */}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {quiz.questions.map((question, index) => {
          const isAnsweredQuestion = Object.prototype.hasOwnProperty.call(
            selectedAnswers,
            question._id,
          );

          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={question._id || index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`h-8 w-8 rounded-lg font-semibold transition-all duration-200 ${
                isCurrent
                  ? "scale-110 bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                  : isAnsweredQuestion
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTakePage;
