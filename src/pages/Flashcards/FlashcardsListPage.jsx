import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService.js";

import PageHeader from "../../components/common/PageHeader.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import FlashcardSetCard from "../../components/flashcarrds/FlashcardSetCard.jsx";

// ==========================================================
// FLASHCARD LIST PAGE
// ==========================================================

const FlashcardListPage = () => {
  // ========================================================
  // STATE
  // ========================================================

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================================
  // FETCH ALL FLASHCARD SETS
  // ========================================================

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        setLoading(true);

        const response = await flashcardService.getAllFlashcardSets();

        console.log("=================================");
        console.log("FETCH FLASHCARD SETS");
        console.log("=================================");
        console.log("Response:", response);

        // ==================================================
        // HANDLE API RESPONSE
        // ==================================================

        const data = response?.data ?? response;

        setFlashcardSets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("FETCH FLASHCARD SETS ERROR:", error);

        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Failed to fetch flashcard sets.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  // ========================================================
  // RENDER CONTENT
  // ========================================================

  const renderContent = () => {
    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
      return <Spinner />;
    }

    // ======================================================
    // EMPTY STATE
    // ======================================================

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No Flashcard Sets Found"
          description="You haven't generated any flashcards yet. Go to a document to create your first set."
        />
      );
    }

    // ======================================================
    // FLASHCARD SET GRID
    // ======================================================

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flashcardSets.map((flashcardSet) => (
          <FlashcardSetCard
            key={flashcardSet._id}
            flashcardSet={flashcardSet}
          />
        ))}
      </div>
    );
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="space-y-6">
      <PageHeader title="All Flashcard Sets" />

      {renderContent()}
    </div>
  );
};

export default FlashcardListPage;
