import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcarrds/Flashcard";

// ==========================================================
// FLASHCARD PAGE
// ==========================================================

const FlashcardPage = () => {
  // ========================================================
  // GET DOCUMENT ID FROM URL
  // ========================================================

  const { id: documentId } = useParams();

  // ========================================================
  // STATE
  // ========================================================

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  // ========================================================
  // FETCH FLASHCARDS
  // ========================================================

  const fetchFlashcards = useCallback(async () => {
    if (!documentId) {
      toast.error("Document ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      console.log("=================================");
      console.log("FETCH FLASHCARDS");
      console.log("=================================");
      console.log("Response:", response);

      // ==================================================
      // HANDLE API RESPONSE
      // ==================================================

      const data = response?.data ?? response;

      const sets = Array.isArray(data) ? data : [];

      setFlashcardSets(sets);

      // ==================================================
      // GET FIRST FLASHCARD SET
      // ==================================================

      const firstSet = sets[0] ?? null;

      const cards = Array.isArray(firstSet?.cards) ? firstSet.cards : [];

      setFlashcards(cards);

      // ==================================================
      // RESET CARD INDEX
      // ==================================================

      setCurrentCardIndex(0);
    } catch (error) {
      console.error("FETCH FLASHCARDS ERROR:", error);

      setFlashcardSets([]);
      setFlashcards([]);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch flashcards.",
      );
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  // ========================================================
  // FETCH ON PAGE LOAD
  // ========================================================

  useEffect(() => {
    void Promise.resolve().then(fetchFlashcards);
  }, [fetchFlashcards]);

  // ========================================================
  // GENERATE FLASHCARDS
  // ========================================================

  const handleGenerateFlashcards = async () => {
    if (!documentId) {
      toast.error("Document ID is missing.");
      return;
    }

    try {
      setGenerating(true);

      await aiService.generateFlashcards(documentId);

      toast.success("Flashcards generated successfully!");

      await fetchFlashcards();
    } catch (error) {
      console.error("GENERATE FLASHCARDS ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to generate flashcards.",
      );
    } finally {
      setGenerating(false);
    }
  };

  // ========================================================
  // REVIEW CURRENT FLASHCARD
  // ========================================================

  const handleReview = async (index) => {
    const currentCard = flashcards[index];

    if (!currentCard?._id) {
      return;
    }

    try {
      await flashcardService.reviewFlashcard(currentCard._id);

      // ==================================================
      // UPDATE LOCAL STATE
      // ==================================================

      setFlashcards((previousCards) =>
        previousCards.map((card) =>
          card._id === currentCard._id
            ? {
                ...card,
                lastReviewed: new Date().toISOString(),
              }
            : card,
        ),
      );
    } catch (error) {
      console.error("REVIEW FLASHCARD ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to review flashcard.",
      );
    }
  };

  // ========================================================
  // NEXT CARD
  // ========================================================

  const handleNextCard = async () => {
    if (flashcards.length <= 1) {
      return;
    }

    await handleReview(currentCardIndex);

    setCurrentCardIndex(
      (previousIndex) => (previousIndex + 1) % flashcards.length,
    );
  };

  // ========================================================
  // PREVIOUS CARD
  // ========================================================

  const handlePrevCard = async () => {
    if (flashcards.length <= 1) {
      return;
    }

    await handleReview(currentCardIndex);

    setCurrentCardIndex(
      (previousIndex) =>
        (previousIndex - 1 + flashcards.length) % flashcards.length,
    );
  };

  // ========================================================
  // TOGGLE STAR
  // ========================================================

  const handleToggleStar = async (cardId) => {
    if (!cardId) {
      return;
    }

    try {
      await flashcardService.toggleStar(cardId);

      setFlashcards((previousFlashcards) =>
        previousFlashcards.map((card) =>
          card._id === cardId
            ? {
                ...card,
                isStarred: !card.isStarred,
              }
            : card,
        ),
      );
    } catch (error) {
      console.error("TOGGLE STAR ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update star status.",
      );
    }
  };

  // ========================================================
  // DELETE FLASHCARD SET
  // ========================================================

  const handleDeleteFlashcardSet = async () => {
    const flashcardSetId = flashcardSets[0]?._id;

    if (!flashcardSetId) {
      toast.error("Flashcard set not found.");
      return;
    }

    try {
      setDeleting(true);

      await flashcardService.deleteFlashcardSet(flashcardSetId);

      toast.success("Flashcard set deleted successfully!");

      setIsDeleteModalOpen(false);

      // ==================================================
      // CLEAR LOCAL STATE
      // ==================================================

      setFlashcardSets([]);
      setFlashcards([]);
      setCurrentCardIndex(0);

      // ==================================================
      // REFRESH FROM BACKEND
      // ==================================================

      await fetchFlashcards();
    } catch (error) {
      console.error("DELETE FLASHCARD SET ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete flashcard set.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // ========================================================
  // RENDER FLASHCARD CONTENT
  // ========================================================

  const renderFlashcardContent = () => {
    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
      return <Spinner />;
    }

    // ======================================================
    // EMPTY STATE
    // ======================================================

    if (flashcards.length === 0) {
      return (
        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards from your document to start learning."
        />
      );
    }

    // ======================================================
    // CURRENT CARD
    // ======================================================

    const currentCard = flashcards[currentCardIndex];

    if (!currentCard) {
      return (
        <EmptyState
          title="Flashcard Not Found"
          description="The current flashcard could not be loaded."
        />
      );
    }

    // ======================================================
    // FLASHCARD UI
    // ======================================================

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-md">
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <span className="text-sm text-neutral-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            type="button"
            onClick={handleNextCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <div>
      {/* ==================================================
          BACK TO DOCUMENT
      ================================================== */}

      <div className="mb-4">
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <PageHeader title="Flashcards">
        <div className="flex gap-2">
          {!loading && (
            <>
              {flashcards.length > 0 ? (
                <Button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 size={16} />
                  Delete Set
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleGenerateFlashcards}
                  disabled={generating}
                >
                  {generating ? (
                    <Spinner />
                  ) : (
                    <>
                      <Plus size={16} />
                      Generate Flashcards
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </PageHeader>

      {/* ==================================================
          FLASHCARD CONTENT
      ================================================== */}

      {renderFlashcardContent()}

      {/* ==================================================
          DELETE MODAL
      ================================================== */}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Flashcard Set"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete all flashcards for this document?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleDeleteFlashcardSet}
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

export default FlashcardPage;
