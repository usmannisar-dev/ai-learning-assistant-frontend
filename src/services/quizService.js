import axiosInstance from "../utils/axiosinstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

// ==========================================================
// QUIZ SERVICE
// ==========================================================

const quizService = {
  // ========================================================
  // GET QUIZZES FOR DOCUMENT
  // ========================================================

  getQuizzesForDocument: async (documentId) => {
    const response = await axiosInstance.get(
      API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOCUMENT(documentId),
    );

    return response.data;
  },

  // ========================================================
  // GET SINGLE QUIZ
  // ========================================================

  getQuizById: async (quizId) => {
    const response = await axiosInstance.get(
      API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId),
    );

    return response.data;
  },

  // ========================================================
  // SUBMIT QUIZ
  // ========================================================

  submitQuiz: async (quizId, answers) => {
    console.log("=================================");
    console.log("QUIZ SERVICE SUBMIT");
    console.log("=================================");

    console.log("Quiz ID:", quizId);
    console.log("Answers:", answers);

    const response = await axiosInstance.post(
      API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
      {
        answers,
      },
    );

    console.log("Submit response:", response.data);

    return response.data;
  },

  // ========================================================
  // GET QUIZ RESULTS
  // ========================================================

  getQuizResults: async (quizId) => {
    const response = await axiosInstance.get(
      API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId),
    );

    return response.data;
  },

  // ========================================================
  // DELETE QUIZ
  // ========================================================

  deleteQuiz: async (quizId) => {
    const response = await axiosInstance.delete(
      API_PATHS.QUIZZES.DELETE_QUIZ(quizId),
    );

    return response.data;
  },
};

export default quizService;
