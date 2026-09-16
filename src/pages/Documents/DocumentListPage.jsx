import { useCallback, useEffect, useState } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService.js";
import Spinner from "../../components/common/Spinner.jsx";
import Button from "../../components/common/Button.jsx";
import DocumentCard from "../../components/documents/DocumentCard.jsx";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await documentService.getDocuments();

      console.log("DOCUMENTS RESPONSE:", response);

      const data = response?.data ?? response;

      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH DOCUMENTS ERROR:", error);

      toast.error(error?.message || "Failed to fetch documents.");

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchDocuments);
  }, [fetchDocuments]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    const maxFileSize = 100 * 1024 * 1024;

    if (file.size > maxFileSize) {
      toast.error("PDF file must be 100MB or smaller.");
      event.target.value = "";
      return;
    }

    setUploadFile(file);

    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    setUploadTitle(fileNameWithoutExtension);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!uploadFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    if (!uploadTitle.trim()) {
      toast.error("Please provide a document title.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", uploadFile);
      formData.append("title", uploadTitle.trim());

      console.log("Uploading document:", {
        title: uploadTitle.trim(),
        file: uploadFile.name,
        size: uploadFile.size,
      });

      await documentService.uploadDocument(formData);

      toast.success("Document uploaded successfully!");

      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");

      await fetchDocuments();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      toast.error(error?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedDoc(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc?._id) {
      return;
    }

    try {
      setDeleting(true);

      await documentService.deleteDocument(selectedDoc._id);

      toast.success(
        `"${selectedDoc.title || "Document"}" deleted successfully.`,
      );

      setDocuments((previousDocuments) =>
        previousDocuments.filter((doc) => doc._id !== selectedDoc._id),
      );

      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
    } catch (error) {
      console.error("DELETE DOCUMENT ERROR:", error);

      toast.error(error?.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    if (uploading) {
      return;
    }

    setIsUploadModalOpen(false);
    setUploadFile(null);
    setUploadTitle("");
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (documents.length === 0) {
      return (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-12 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <FileText className="h-8 w-8 text-slate-400" strokeWidth={2} />
          </div>

          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            No documents yet
          </h2>

          <p className="mx-auto mb-6 max-w-md text-sm text-slate-500">
            Upload your first PDF and start learning with AI-powered summaries,
            flashcards, quizzes, and chat.
          </p>

          <Button onClick={handleOpenUploadModal}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Upload Document
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size:[16px_16px] opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        {/* Page header */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
              My Documents
            </h1>

            <p className="text-sm text-slate-500">
              Manage and organize your learning materials.
            </p>
          </div>

          {documents.length > 0 && (
            <Button onClick={handleOpenUploadModal}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>

        {renderContent()}
      </div>

      {/* =========================
          UPLOAD MODAL
      ========================== */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={handleCloseUploadModal}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseUploadModal}
              disabled={uploading}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close upload modal"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="mb-6 pr-10">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Upload New Document
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a PDF document to your library.
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="document-title"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  Document Title
                </label>

                <input
                  id="document-title"
                  type="text"
                  value={uploadTitle}
                  onChange={(event) => setUploadTitle(event.target.value)}
                  required
                  disabled={uploading}
                  placeholder="e.g. React Interview Prep"
                  className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* File upload */}
              <div className="space-y-2">
                <label
                  htmlFor="file-upload"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  PDF File
                </label>

                <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/30">
                  <input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    onChange={handleFileChange}
                    accept=".pdf,application/pdf"
                    disabled={uploading}
                  />

                  <div className="flex flex-col items-center justify-center px-6 py-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-teal-100">
                      <Upload
                        className="h-7 w-7 text-emerald-600"
                        strokeWidth={2}
                      />
                    </div>

                    <p className="mb-1 text-center text-sm font-medium text-slate-700">
                      {uploadFile ? (
                        <span className="break-all text-emerald-600">
                          {uploadFile.name}
                        </span>
                      ) : (
                        <>
                          <span className="text-emerald-600">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>

                    <p className="text-xs text-slate-500">PDF up to 100MB</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseUploadModal}
                  disabled={uploading}
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading || !uploadFile || !uploadTitle.trim()}
                  className="flex-1 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE MODAL
      ========================== */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              disabled={deleting}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close delete modal"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="mb-6 pr-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-red-100 to-red-200">
                <Trash2 className="h-6 w-6 text-red-600" strokeWidth={2} />
              </div>

              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Confirm Deletion
              </h2>
            </div>

            <p className="mb-6 text-sm leading-6 text-slate-600">
              Are you sure you want to delete the document{" "}
              <span className="font-semibold text-slate-900">
                "{selectedDoc?.title || "Untitled Document"}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-linear-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
