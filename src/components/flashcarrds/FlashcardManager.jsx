import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService.js";
import aiService from "../../services/aiService.js";
import Spinner from "../common/Spinner.jsx";
import Modal from "../common/Modal.jsx";
import Flashcard from "./Flashcard.jsx";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  // =========================================================
  // FETCH FLASHCARD SETS
  // =========================================================
  const fetchFlashcardSets = useCallback(async () => {
    if (!documentId) {
      setFlashcardSets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      console.log("FLASHCARD SETS RESPONSE:", response);

      const data = response?.data ?? response;

      setFlashcardSets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH FLASHCARD SETS ERROR:", error);

      toast.error(error?.message || "Failed to fetch flashcard sets.");

      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  // =========================================================
  // LOAD FLASHCARD SETS
  // =========================================================
  useEffect(() => {
    void Promise.resolve().then(fetchFlashcardSets);
  }, [fetchFlashcardSets]);

  // =========================================================
  // GENERATE FLASHCARDS
  // =========================================================
  const handleGenerateFlashcards = async () => {
    if (!documentId) {
      toast.error("Document ID is missing.");
      return;
    }

    try {
      setGenerating(true);

      const response = await aiService.generateFlashcards(documentId);

      console.log("GENERATE FLASHCARDS RESPONSE:", response);

      toast.success("Flashcards generated successfully!");

      await fetchFlashcardSets();
    } catch (error) {
      console.error("GENERATE FLASHCARDS ERROR:", error);

      toast.error(error?.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // =========================================================
  // NEXT CARD
  // =========================================================
  const handleNextCard = () => {
    if (
      !selectedSet ||
      !Array.isArray(selectedSet.cards) ||
      selectedSet.cards.length === 0
    ) {
      return;
    }

    handleReview();

    setCurrentCardIndex(
      (previousIndex) => (previousIndex + 1) % selectedSet.cards.length,
    );
  };

  // =========================================================
  // PREVIOUS CARD
  // =========================================================
  const handlePrevCard = () => {
    if (
      !selectedSet ||
      !Array.isArray(selectedSet.cards) ||
      selectedSet.cards.length === 0
    ) {
      return;
    }

    handleReview();

    setCurrentCardIndex(
      (previousIndex) =>
        (previousIndex - 1 + selectedSet.cards.length) %
        selectedSet.cards.length,
    );
  };

  // =========================================================
  // REVIEW CURRENT FLASHCARD
  // =========================================================
  const handleReview = async () => {
    const currentCard = selectedSet?.cards?.[currentCardIndex];

    if (!currentCard?._id) {
      return;
    }

    try {
      await flashcardService.reviewFlashcard(currentCard._id);

      console.log("FLASHCARD REVIEWED:", currentCard._id);
    } catch (error) {
      console.error("REVIEW FLASHCARD ERROR:", error);

      toast.error("Failed to review flashcard.");
    }
  };

  // =========================================================
  // TOGGLE STAR
  // =========================================================
  const handleToggleStar = async (cardId) => {
    if (!cardId || !selectedSet) {
      return;
    }

    try {
      await flashcardService.toggleStar(cardId);

      const updatedSets = flashcardSets.map((flashcardSet) => {
        if (flashcardSet._id !== selectedSet._id) {
          return flashcardSet;
        }

        const updatedCards = (flashcardSet.cards || []).map((card) =>
          card._id === cardId
            ? {
                ...card,
                isStarred: !card.isStarred,
              }
            : card,
        );

        return {
          ...flashcardSet,
          cards: updatedCards,
        };
      });

      setFlashcardSets(updatedSets);

      const updatedSelectedSet = updatedSets.find(
        (flashcardSet) => flashcardSet._id === selectedSet._id,
      );

      setSelectedSet(updatedSelectedSet || null);

      toast.success("Flashcard star status updated!");
    } catch (error) {
      console.error("TOGGLE STAR ERROR:", error);

      toast.error(error?.message || "Failed to update star status.");
    }
  };

  // =========================================================
  // OPEN DELETE CONFIRMATION
  // =========================================================
  const handleDeleteRequest = (event, flashcardSet) => {
    event.stopPropagation();

    setSetToDelete(flashcardSet);
    setIsDeleteModalOpen(true);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================
  const handleConfirmDelete = async () => {
    if (!setToDelete?._id) {
      return;
    }

    try {
      setDeleting(true);

      await flashcardService.deleteFlashcardSet(setToDelete._id);

      toast.success("Flashcard set deleted successfully!");

      setIsDeleteModalOpen(false);
      setSetToDelete(null);

      // IF THE DELETED SET WAS OPEN
      if (selectedSet?._id === setToDelete._id) {
        setSelectedSet(null);
        setCurrentCardIndex(0);
      }

      await fetchFlashcardSets();
    } catch (error) {
      console.error("DELETE FLASHCARD SET ERROR:", error);

      toast.error(error?.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // SELECT FLASHCARD SET
  // =========================================================
  const handleSelectSet = (flashcardSet) => {
    setSelectedSet(flashcardSet);
    setCurrentCardIndex(0);
  };

  // =========================================================
  // RENDER FLASHCARD VIEWER
  // =========================================================
  const renderFlashcardViewer = () => {
    if (
      !selectedSet ||
      !Array.isArray(selectedSet.cards) ||
      selectedSet.cards.length === 0
    ) {
      return null;
    }

    const currentCard = selectedSet.cards[currentCardIndex];

    if (!currentCard) {
      return null;
    }

    return (
      <div className="space-y-8">
        {/* =====================================================
            BACK BUTTON
        ===================================================== */}
        <button
          type="button"
          onClick={() => {
            setSelectedSet(null);
            setCurrentCardIndex(0);
          }}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-emerald-600"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            strokeWidth={2}
          />
          Back to Sets
        </button>

        {/* =====================================================
            FLASHCARD DISPLAY
        ===================================================== */}
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* ===================================================
              NAVIGATION
          =================================================== */}
          <div className="flex items-center gap-6">
            {/* PREVIOUS */}
            <button
              type="button"
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                strokeWidth={2.5}
              />
              Previous
            </button>

            {/* CARD COUNTER */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="text-sm font-medium text-slate-700">
                {currentCardIndex + 1}

                <span className="px-1 text-slate-400">/</span>

                {selectedSet.cards.length}
              </span>
            </div>

            {/* NEXT */}
            <button
              type="button"
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className="group flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================
  // RENDER SET LIST
  // =========================================================
  const renderSetList = () => {
    // =======================================================
    // LOADING
    // =======================================================
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    // =======================================================
    // EMPTY STATE
    // =======================================================
    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100">
            <Brain className="h-8 w-8 text-emerald-600" strokeWidth={2} />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            No Flashcards Yet
          </h3>

          <p className="mb-8 max-w-sm text-center text-sm text-slate-500">
            Generate flashcards from your document to start learning and
            reinforce your knowledge.
          </p>

          <button
            type="button"
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            {generating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    // =======================================================
    // SET LIST
    // =======================================================
    return (
      <div className="space-y-6">
        {/* ===================================================
            HEADER
        =================================================== */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Flashcard Sets
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "set" : "sets"} available
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        {/* ===================================================
            FLASHCARD SET GRID
        =================================================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flashcardSets.map((flashcardSet) => (
            <div
              key={flashcardSet._id}
              onClick={() => handleSelectSet(flashcardSet)}
              className="group relative cursor-pointer rounded-2xl border-2 border-slate-200 bg-white/80 p-6 backdrop-blur-xl transition-all duration-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              {/* DELETE BUTTON */}
              <button
                type="button"
                onClick={(event) => handleDeleteRequest(event, flashcardSet)}
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 opacity-0 transition-all duration-200 hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                aria-label="Delete flashcard set"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>

              {/* SET CONTENT */}
              <div className="space-y-4">
                {/* ICON */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-teal-100">
                  <Brain className="h-6 w-6 text-emerald-600" strokeWidth={2} />
                </div>

                {/* TITLE */}
                <div>
                  <h4 className="mb-1 text-base font-semibold text-slate-900">
                    Flashcard Set
                  </h4>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Created{" "}
                    {flashcardSet.createdAt
                      ? moment(flashcardSet.createdAt).format("MMM DD, YYYY")
                      : "Recently"}
                  </p>
                </div>

                {/* CARD COUNT */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                    <span className="text-sm font-semibold text-emerald-700">
                      {flashcardSet.cards?.length ?? 0}{" "}
                      {(flashcardSet.cards?.length ?? 0) === 1
                        ? "card"
                        : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* =======================================================
          MAIN FLASHCARD MANAGER
      ======================================================= */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      {/* =======================================================
          DELETE CONFIRMATION MODAL
      ======================================================= */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setIsDeleteModalOpen(false);
          }
        }}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p className="text-sm leading-relaxed text-slate-600">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone and all cards will be permanently removed.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            {/* CANCEL */}
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {/* DELETE */}
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="h-11 rounded-xl bg-linear-to-r from-rose-500 to-red-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:from-rose-600 hover:to-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
