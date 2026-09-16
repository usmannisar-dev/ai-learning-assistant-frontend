import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService.js";
import aiService from "../../services/aiService.js";

import Spinner from "../common/Spinner.jsx";
import Button from "../common/Button.jsx";
import QuizCard from "./QuizCard.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Modal from "../common/Modal.jsx";

// =========================================================
// QUIZ MANAGER
// =========================================================

const QuizManager = ({ documentId }) => {
  // =========================================================
  // STATE
  // =========================================================

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // =========================================================
  // FETCH QUIZZES
  // =========================================================

  const fetchQuizzes = useCallback(async () => {
    if (!documentId) return;

    try {
      setLoading(true);

      const response = await quizService.getQuizzesForDocument(documentId);

      console.log("QUIZZES RESPONSE:", response);

      setQuizzes(response?.data ?? []);
    } catch (error) {
      console.error("FETCH QUIZZES ERROR:", error);

      toast.error(error?.message || "Failed to fetch quizzes.");

      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  // =========================================================
  // FETCH ON DOCUMENT CHANGE
  // =========================================================

  useEffect(() => {
    void Promise.resolve().then(fetchQuizzes);
  }, [fetchQuizzes]);

  // =========================================================
  // GENERATE QUIZ
  // =========================================================

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();

    try {
      setGenerating(true);

      await aiService.generateQuiz(documentId, {
        numQuestions,
      });

      toast.success("Quiz generated successfully!");

      setIsGenerateModalOpen(false);

      await fetchQuizzes();
    } catch (error) {
      console.error("GENERATE QUIZ ERROR:", error);

      toast.error(error?.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  // =========================================================
  // OPEN DELETE MODAL
  // =========================================================

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) {
      return;
    }

    try {
      setDeleting(true);

      await quizService.deleteQuiz(selectedQuiz._id);

      toast.success(`"${selectedQuiz.title || "Quiz"}" deleted successfully.`);

      // REMOVE QUIZ FROM LOCAL STATE
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz._id !== selectedQuiz._id),
      );

      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
    } catch (error) {
      console.error("DELETE QUIZ ERROR:", error);

      toast.error(error?.message || "Failed to delete quiz.");
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // RENDER QUIZ CONTENT
  // =========================================================

  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes Yet"
          description="Generate a quiz from your document to test your knowledge."
          buttonText="Generate Quiz"
          onActionClick={() => setIsGenerateModalOpen(true)}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setIsGenerateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          <Plus size={16} />
          Generate Quiz
        </button>
      </div>

      {renderQuizContent()}

      {/* =====================================================
          GENERATE QUIZ MODAL
      ===================================================== */}

      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-700">
              Number of Questions
            </label>

            <input
              type="number"
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(
                  Math.max(1, Number.parseInt(e.target.value, 10) || 1),
                )
              }
              min="1"
              max="50"
              required
              className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-colors duration-150 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#00d492]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={generating}>
              {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* =====================================================
          DELETE QUIZ MODAL
      ===================================================== */}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setIsDeleteModalOpen(false);
            setSelectedQuiz(null);
          }
        }}
        title="Confirm Delete Quiz"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-neutral-900">
              {selectedQuiz?.title || "this quiz"}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedQuiz(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizManager;
