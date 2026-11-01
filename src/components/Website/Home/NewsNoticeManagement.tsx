
"use client";

import React, {
  ChangeEvent,
  ReactNode,
  useRef,
  useState,
} from "react";

import {
  INews,
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetNewsQuery,
  useUpdateNewsMutation,
} from "@/redux/api/website/home/NewsApi";

import {
  INotice,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useGetNoticeQuery,
  useUpdateNoticeMutation,
} from "@/redux/api/website/home/NoticeApi";

import {
  Bell,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Loader2,
  Megaphone,
  Newspaper,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { toast } from "react-toastify";

/* =========================================================
   TYPES
========================================================= */

interface ICloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  original_filename?: string;
  resource_type?: string;
  format?: string;
}

interface ExistingDocument {
  url: string;
  name: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
];

/* =========================================================
   CLOUDINARY UPLOAD
========================================================= */

const uploadDocumentToCloudinary = async (
  file: File,
): Promise<ICloudinaryUploadResponse> => {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();

  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name is not configured.",
    );
  }

  if (!uploadPreset) {
    throw new Error(
      "Cloudinary upload preset is not configured.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  /*
   * IMPORTANT:
   * Do not use console.cloudinary.com here.
   *
   * Correct:
   * https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/raw/upload
   */

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Failed to upload document to Cloudinary.",
    );
  }

  if (!result?.secure_url) {
    throw new Error(
      "Cloudinary did not return a document URL.",
    );
  }

  return result;
};

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const errorObject = error as {
      data?: {
        message?: string;
        error?: string;
      };
      message?: string;
      error?: string;
    };

    return (
      errorObject?.data?.message ||
      errorObject?.data?.error ||
      errorObject?.message ||
      errorObject?.error ||
      fallback
    );
  }

  return fallback;
};

const formatDate = (
  date?: string | Date,
): string => {
  if (!date) return "N/A";

  try {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  } catch {
    return "N/A";
  }
};

const getFileExtension = (
  fileName: string,
): string => {
  const parts = fileName.split(".");
  return parts.length > 1
    ? `.${parts.pop()?.toLowerCase()}`
    : "";
};

const validateFile = (
  file: File,
): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return "File size must not exceed 10 MB.";
  }

  const extension =
    getFileExtension(file.name);

  if (
    !ALLOWED_FILE_EXTENSIONS.includes(
      extension,
    )
  ) {
    return (
      "Invalid file type. Allowed files: " +
      "PDF, DOC, DOCX, XLS, XLSX, PPT and PPTX."
    );
  }

  return null;
};

/* =========================================================
   DOCUMENT PICKER
========================================================= */

interface DocumentPickerProps {
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  inputRef: {
    current: HTMLInputElement | null;
  };
  disabled?: boolean;
}

const DocumentPicker = ({
  file,
  onChange,
  onRemove,
  inputRef,
  disabled = false,
}: DocumentPickerProps) => {
  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            inputRef.current?.click()
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-5 text-sm font-medium text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload size={20} />
          Select Document
        </button>
      ) : (
        <SelectedDocument
          file={file}
          onRemove={onRemove}
        />
      )}

      <p className="text-xs text-gray-500">
        Supported: PDF, DOC, DOCX, XLS, XLSX,
        PPT, PPTX. Maximum size: 10 MB.
      </p>
    </div>
  );
};

/* =========================================================
   SELECTED DOCUMENT
========================================================= */

interface SelectedDocumentProps {
  file: File;
  onRemove: () => void;
}

const SelectedDocument = ({
  file,
  onRemove,
}: SelectedDocumentProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-lg bg-white p-2 text-blue-600">
          <FileText size={20} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-800">
            {file.name}
          </p>

          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(
              2,
            )}{" "}
            MB
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-2 text-red-500 hover:bg-red-100"
        title="Remove selected document"
      >
        <X size={18} />
      </button>
    </div>
  );
};

/* =========================================================
   EXISTING DOCUMENT
========================================================= */

interface ExistingDocumentProps {
  document: ExistingDocument;
  onRemove: () => void;
}

const ExistingDocumentPreview = ({
  document,
  onRemove,
}: ExistingDocumentProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">
              {document.name}
            </p>

            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              View document
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-2 text-red-500 hover:bg-red-100"
          title="Remove existing document"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   DOCUMENT LINK
========================================================= */

interface DocumentLinkProps {
  url?: string | null;
  name?: string | null;
}

const DocumentLink = ({
  url,
  name,
}: DocumentLinkProps) => {
  if (!url) return null;

  return (
    <div className="mt-3 flex items-center gap-2">
      <FileText
        size={18}
        className="text-blue-600"
      />

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate text-sm font-medium text-blue-600 hover:underline"
      >
        {name || "View document"}
      </a>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
        title="Download"
      >
        <Download size={16} />
      </a>
    </div>
  );
};

/* =========================================================
   LOADING LIST
========================================================= */

const LoadingList = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2
        size={28}
        className="animate-spin text-blue-600"
      />
    </div>
  );
};

/* =========================================================
   ERROR STATE
========================================================= */

interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({
  message = "Failed to load data.",
}: ErrorStateProps) => {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
      {message}
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
}

const EmptyState = ({
  icon,
  message,
}: EmptyStateProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center">
      <div className="mb-3 flex justify-center text-gray-400">
        {icon}
      </div>

      <p className="text-sm text-gray-500">
        {message}
      </p>
    </div>
  );
};

/* =========================================================
   DELETE CONFIRMATION MODAL
========================================================= */

interface DeleteConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  open,
  title,
  message,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <Trash2 size={22} />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        <p className="mb-6 text-sm text-gray-600">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const NewsNoticeManagement = () => {
  /* =======================================================
     ACTIVE TAB
  ======================================================= */

  const [activeTab, setActiveTab] =
    useState<"news" | "notice">("news");

  /* =======================================================
     NEWS STATE
  ======================================================= */

  const [newsText, setNewsText] =
    useState("");

  const [newsDocument, setNewsDocument] =
    useState<File | null>(null);

  const [existingNewsDocument, setExistingNewsDocument] =
    useState<ExistingDocument | null>(null);

  const [removeNewsDocument, setRemoveNewsDocument] =
    useState(false);

  const [editingNewsId, setEditingNewsId] =
    useState<string | null>(null);

  /* =======================================================
     NOTICE STATE
  ======================================================= */

  const [noticeText, setNoticeText] =
    useState("");

  const [noticeDocument, setNoticeDocument] =
    useState<File | null>(null);

  const [existingNoticeDocument, setExistingNoticeDocument] =
    useState<ExistingDocument | null>(null);

  const [removeNoticeDocument, setRemoveNoticeDocument] =
    useState(false);

  const [editingNoticeId, setEditingNoticeId] =
    useState<string | null>(null);

  /* =======================================================
     DELETE STATE
  ======================================================= */

  const [deleteType, setDeleteType] =
    useState<"news" | "notice" | null>(
      null,
    );

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  /* =======================================================
     UPLOAD STATE
  ======================================================= */

  const [uploadingNewsDocument, setUploadingNewsDocument] =
    useState(false);

  const [uploadingNoticeDocument, setUploadingNoticeDocument] =
    useState(false);

  /* =======================================================
     FILE INPUT REFS
  ======================================================= */

  const newsFileInputRef =
    useRef<HTMLInputElement | null>(null);

  const noticeFileInputRef =
    useRef<HTMLInputElement | null>(null);

  /* =======================================================
     API
  ======================================================= */

  const {
    data: newsData,
    isLoading: newsLoading,
    isError: newsError,
    refetch: refetchNews,
  } = useGetNewsQuery(undefined);

  const {
    data: noticeData,
    isLoading: noticeLoading,
    isError: noticeError,
    refetch: refetchNotices,
  } = useGetNoticeQuery(undefined);

  const [
    createNews,
    { isLoading: creatingNews },
  ] = useCreateNewsMutation();

  const [
    updateNews,
    { isLoading: updatingNews },
  ] = useUpdateNewsMutation();

  const [
    deleteNews,
    { isLoading: deletingNews },
  ] = useDeleteNewsMutation();

  const [
    createNotice,
    { isLoading: creatingNotice },
  ] = useCreateNoticeMutation();

  const [
    updateNotice,
    { isLoading: updatingNotice },
  ] = useUpdateNoticeMutation();

  const [
    deleteNotice,
    { isLoading: deletingNotice },
  ] = useDeleteNoticeMutation();

  /* =======================================================
     NORMALIZE API DATA
  ======================================================= */

  const newsList: INews[] =
    Array.isArray(newsData)
      ? newsData
      : (newsData as any)?.data ||
        (newsData as any)?.results ||
        [];

  const noticeList: INotice[] =
    Array.isArray(noticeData)
      ? noticeData
      : (noticeData as any)?.data ||
        (noticeData as any)?.results ||
        [];

  /* =======================================================
     NEWS FILE CHANGE
  ======================================================= */

  const handleNewsFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const validationError =
      validateFile(file);

    if (validationError) {
      toast.error(validationError);

      if (newsFileInputRef.current) {
        newsFileInputRef.current.value =
          "";
      }

      return;
    }

    setNewsDocument(file);

    /*
     * Selecting a new document means:
     * - don't remove existing document
     * - new Cloudinary file will replace it
     */
    setRemoveNewsDocument(false);
  };

  /* =======================================================
     NOTICE FILE CHANGE
  ======================================================= */

  const handleNoticeFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const validationError =
      validateFile(file);

    if (validationError) {
      toast.error(validationError);

      if (noticeFileInputRef.current) {
        noticeFileInputRef.current.value =
          "";
      }

      return;
    }

    setNoticeDocument(file);

    setRemoveNoticeDocument(false);
  };

  /* =======================================================
     REMOVE SELECTED NEWS FILE
  ======================================================= */

  const handleRemoveNewsFile = () => {
    setNewsDocument(null);

    if (newsFileInputRef.current) {
      newsFileInputRef.current.value = "";
    }
  };

  /* =======================================================
     REMOVE SELECTED NOTICE FILE
  ======================================================= */

  const handleRemoveNoticeFile = () => {
    setNoticeDocument(null);

    if (noticeFileInputRef.current) {
      noticeFileInputRef.current.value = "";
    }
  };

  /* =======================================================
     REMOVE EXISTING NEWS DOCUMENT
  ======================================================= */

  const handleRemoveExistingNewsDocument =
    () => {
      setExistingNewsDocument(null);
      setRemoveNewsDocument(true);
    };

  /* =======================================================
     REMOVE EXISTING NOTICE DOCUMENT
  ======================================================= */

  const handleRemoveExistingNoticeDocument =
    () => {
      setExistingNoticeDocument(null);
      setRemoveNoticeDocument(true);
    };

  /* =======================================================
     RESET NEWS FORM
  ======================================================= */

  const resetNewsForm = () => {
    setNewsText("");
    setNewsDocument(null);
    setExistingNewsDocument(null);
    setRemoveNewsDocument(false);
    setEditingNewsId(null);
    setUploadingNewsDocument(false);

    if (newsFileInputRef.current) {
      newsFileInputRef.current.value = "";
    }
  };

  /* =======================================================
     RESET NOTICE FORM
  ======================================================= */

  const resetNoticeForm = () => {
    setNoticeText("");
    setNoticeDocument(null);
    setExistingNoticeDocument(null);
    setRemoveNoticeDocument(false);
    setEditingNoticeId(null);
    setUploadingNoticeDocument(false);

    if (noticeFileInputRef.current) {
      noticeFileInputRef.current.value = "";
    }
  };

  /* =======================================================
     EDIT NEWS
  ======================================================= */

  const handleEditNews = (
    news: INews,
  ) => {
    setActiveTab("news");

    setEditingNewsId(
      news.news_id,
    );

    setNewsText(news.text || "");

    setNewsDocument(null);

    /*
     * Existing document fields
     */
    if (
      (news as any).documentUrl
    ) {
      setExistingNewsDocument({
        url: (news as any).documentUrl,
        name:
          (news as any).documentName ||
          "Document",
      });
    } else {
      setExistingNewsDocument(null);
    }

    setRemoveNewsDocument(false);

    if (newsFileInputRef.current) {
      newsFileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     EDIT NOTICE
  ======================================================= */

  const handleEditNotice = (
    notice: INotice,
  ) => {
    setActiveTab("notice");

    setEditingNoticeId(
      notice.notice_id,
    );

    setNoticeText(
      notice.text || "",
    );

    setNoticeDocument(null);

    if (
      (notice as any).documentUrl
    ) {
      setExistingNoticeDocument({
        url: (notice as any).documentUrl,
        name:
          (notice as any).documentName ||
          "Document",
      });
    } else {
      setExistingNoticeDocument(null);
    }

    setRemoveNoticeDocument(false);

    if (noticeFileInputRef.current) {
      noticeFileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SAVE NEWS
  ======================================================= */

  const handleSaveNews = async () => {
    const text = newsText.trim();

    if (!text) {
      toast.error("Please enter news.");
      return;
    }

    if (text.length > 500) {
      toast.error(
        "News cannot exceed 500 characters.",
      );
      return;
    }

    try {
      let documentUrl:
        | string
        | undefined;

      let documentName:
        | string
        | undefined;

      /*
       * STEP 1:
       * Upload selected file to Cloudinary
       */
      if (newsDocument) {
        setUploadingNewsDocument(true);

        toast.info(
          "Uploading document to Cloudinary...",
          {
            autoClose: 2000,
          },
        );

        const cloudinaryResult =
          await uploadDocumentToCloudinary(
            newsDocument,
          );

        documentUrl =
          cloudinaryResult.secure_url;

        documentName =
          newsDocument.name;

        setUploadingNewsDocument(false);
      }

      /*
       * STEP 2:
       * Update existing news
       */
      if (editingNewsId) {
        const updateData = {
          text,

          /*
           * New file selected
           */
          ...(newsDocument
            ? {
                documentUrl,
                documentName,
              }
            : {}),

          /*
           * No new file and existing file
           * should remain
           */
          ...(!newsDocument &&
          existingNewsDocument &&
          !removeNewsDocument
            ? {
                documentUrl:
                  existingNewsDocument.url,
                documentName:
                  existingNewsDocument.name,
              }
            : {}),

          /*
           * User removed existing document
           * and did not select a replacement
           */
          ...(removeNewsDocument &&
          !newsDocument
            ? {
                removeDocument: true,
              }
            : {}),
        };

        console.log(
          "Update News Data:",
          updateData,
        );

        await updateNews({
          id: editingNewsId,
          data: updateData,
        }).unwrap();

        toast.success(
          "News updated successfully.",
        );
      }

      /*
       * STEP 3:
       * Create new news
       */
      else {
        const createData = {
          text,

          ...(newsDocument
            ? {
                documentUrl,
                documentName,
              }
            : {}),
        };

        console.log(
          "Create News Data:",
          createData,
        );

        await createNews(
          createData,
        ).unwrap();

        toast.success(
          "News added successfully.",
        );
      }

      resetNewsForm();

      await refetchNews();
    } catch (error) {
      console.error(
        "Save news error:",
        error,
      );

      setUploadingNewsDocument(false);

      toast.error(
        getErrorMessage(
          error,
          editingNewsId
            ? "Failed to update news."
            : "Failed to add news.",
        ),
      );
    }
  };

  /* =======================================================
     SAVE NOTICE
  ======================================================= */

  const handleSaveNotice = async () => {
    const text = noticeText.trim();

    if (!text) {
      toast.error(
        "Please enter notice.",
      );
      return;
    }

    if (text.length > 500) {
      toast.error(
        "Notice cannot exceed 500 characters.",
      );
      return;
    }

    try {
      let documentUrl:
        | string
        | undefined;

      let documentName:
        | string
        | undefined;

      /*
       * STEP 1:
       * Upload selected file to Cloudinary
       */
      if (noticeDocument) {
        setUploadingNoticeDocument(true);

        toast.info(
          "Uploading document to Cloudinary...",
          {
            autoClose: 2000,
          },
        );

        const cloudinaryResult =
          await uploadDocumentToCloudinary(
            noticeDocument,
          );

        documentUrl =
          cloudinaryResult.secure_url;

        documentName =
          noticeDocument.name;

        setUploadingNoticeDocument(false);
      }

      /*
       * STEP 2:
       * Update existing notice
       */
      if (editingNoticeId) {
        const updateData = {
          text,

          /*
           * New document
           */
          ...(noticeDocument
            ? {
                documentUrl,
                documentName,
              }
            : {}),

          /*
           * Keep existing document
           */
          ...(!noticeDocument &&
          existingNoticeDocument &&
          !removeNoticeDocument
            ? {
                documentUrl:
                  existingNoticeDocument.url,
                documentName:
                  existingNoticeDocument.name,
              }
            : {}),

          /*
           * Remove document
           */
          ...(removeNoticeDocument &&
          !noticeDocument
            ? {
                removeDocument: true,
              }
            : {}),
        };

        console.log(
          "Update Notice Data:",
          updateData,
        );

        await updateNotice({
          id: editingNoticeId,
          data: updateData,
        }).unwrap();

        toast.success(
          "Notice updated successfully.",
        );
      }

      /*
       * STEP 3:
       * Create new notice
       */
      else {
        const createData = {
          text,

          ...(noticeDocument
            ? {
                documentUrl,
                documentName,
              }
            : {}),
        };

        console.log(
          "Create Notice Data:",
          createData,
        );

        await createNotice(
          createData,
        ).unwrap();

        toast.success(
          "Notice added successfully.",
        );
      }

      resetNoticeForm();

      await refetchNotices();
    } catch (error) {
      console.error(
        "Save notice error:",
        error,
      );

      setUploadingNoticeDocument(false);

      toast.error(
        getErrorMessage(
          error,
          editingNoticeId
            ? "Failed to update notice."
            : "Failed to add notice.",
        ),
      );
    }
  };

  /* =======================================================
     DELETE NEWS
  ======================================================= */

  const handleDeleteNews = async () => {
    if (!deleteId) return;

    try {
      await deleteNews(
        deleteId,
      ).unwrap();

      toast.success(
        "News deleted successfully.",
      );

      setDeleteId(null);
      setDeleteType(null);

      await refetchNews();
    } catch (error) {
      console.error(
        "Delete news error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to delete news.",
        ),
      );
    }
  };

  /* =======================================================
     DELETE NOTICE
  ======================================================= */

  const handleDeleteNotice = async () => {
    if (!deleteId) return;

    try {
      await deleteNotice(
        deleteId,
      ).unwrap();

      toast.success(
        "Notice deleted successfully.",
      );

      setDeleteId(null);
      setDeleteType(null);

      await refetchNotices();
    } catch (error) {
      console.error(
        "Delete notice error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to delete notice.",
        ),
      );
    }
  };

  /* =======================================================
     DELETE CONFIRM
  ======================================================= */

  const handleConfirmDelete = async () => {
    if (deleteType === "news") {
      await handleDeleteNews();
    }

    if (deleteType === "notice") {
      await handleDeleteNotice();
    }
  };

  /* =======================================================
     LOADING BUTTON STATES
  ======================================================= */

  const newsSaving =
    creatingNews ||
    updatingNews ||
    uploadingNewsDocument;

  const noticeSaving =
    creatingNotice ||
    updatingNotice ||
    uploadingNoticeDocument;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          News & Notice Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage news, notices and their
          optional documents.
        </p>
      </div>

      {/* ===================================================
          TABS
      =================================================== */}

      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2">
        <button
          type="button"
          onClick={() =>
            setActiveTab("news")
          }
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "news"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Newspaper size={18} />
          News
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("notice")
          }
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "notice"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Bell size={18} />
          Notice
        </button>
      </div>

      {/* ===================================================
          NEWS TAB
      =================================================== */}

      {activeTab === "news" && (
        <div className="space-y-6">
          {/* FORM */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingNewsId
                    ? "Update News"
                    : "Add News"}
                </h2>

                <p className="text-sm text-gray-500">
                  Add news with an optional
                  document.
                </p>
              </div>

              {editingNewsId && (
                <button
                  type="button"
                  onClick={resetNewsForm}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* NEWS TEXT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  News
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={newsText}
                  onChange={(e) =>
                    setNewsText(
                      e.target.value,
                    )
                  }
                  rows={5}
                  maxLength={500}
                  placeholder="Enter news..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-1 text-right text-xs text-gray-400">
                  {newsText.length}/500
                </div>
              </div>

              {/* EXISTING DOCUMENT */}

              {editingNewsId &&
                existingNewsDocument &&
                !removeNewsDocument && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Existing Document
                    </label>

                    <ExistingDocumentPreview
                      document={
                        existingNewsDocument
                      }
                      onRemove={
                        handleRemoveExistingNewsDocument
                      }
                    />
                  </div>
                )}

              {/* NEW DOCUMENT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {editingNewsId
                    ? "Replace Document"
                    : "Document"}
                </label>

                <DocumentPicker
                  file={newsDocument}
                  onChange={
                    handleNewsFileChange
                  }
                  onRemove={
                    handleRemoveNewsFile
                  }
                  inputRef={
                    newsFileInputRef
                  }
                  disabled={newsSaving}
                />
              </div>

              {/* SAVE */}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={
                    handleSaveNews
                  }
                  disabled={newsSaving}
                  className="flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {newsSaving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      {uploadingNewsDocument
                        ? "Uploading..."
                        : editingNewsId
                          ? "Updating..."
                          : "Saving..."}
                    </>
                  ) : editingNewsId ? (
                    <>
                      <Save size={18} />
                      Update News
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add News
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* NEWS LIST */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Newspaper
                size={20}
                className="text-blue-600"
              />

              <h2 className="text-lg font-semibold text-gray-900">
                News List
              </h2>
            </div>

            {newsLoading ? (
              <LoadingList />
            ) : newsError ? (
              <ErrorState message="Failed to load news." />
            ) : newsList.length === 0 ? (
              <EmptyState
                icon={<Newspaper size={36} />}
                message="No news found."
              />
            ) : (
              <div className="space-y-4">
                {newsList.map((news) => (
                  <div
                    key={news.news_id}
                    className="rounded-lg border border-gray-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                          {news.text}
                        </p>

                        <div className="mt-2 text-xs text-gray-400">
                          {formatDate(
                            (news as any)
                              .createdAt,
                          )}
                        </div>

                        <DocumentLink
                          url={
                            (news as any)
                              .documentUrl
                          }
                          name={
                            (news as any)
                              .documentName
                          }
                        />
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditNews(
                              news,
                            )
                          }
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Edit news"
                        >
                          <Edit3
                            size={18}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteType(
                              "news",
                            );
                            setDeleteId(
                              news.news_id,
                            );
                          }}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Delete news"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          NOTICE TAB
      =================================================== */}

      {activeTab === "notice" && (
        <div className="space-y-6">
          {/* FORM */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingNoticeId
                    ? "Update Notice"
                    : "Add Notice"}
                </h2>

                <p className="text-sm text-gray-500">
                  Add notice with an optional
                  document.
                </p>
              </div>

              {editingNoticeId && (
                <button
                  type="button"
                  onClick={
                    resetNoticeForm
                  }
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* NOTICE TEXT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notice
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={noticeText}
                  onChange={(e) =>
                    setNoticeText(
                      e.target.value,
                    )
                  }
                  rows={5}
                  maxLength={500}
                  placeholder="Enter notice..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-1 text-right text-xs text-gray-400">
                  {noticeText.length}/500
                </div>
              </div>

              {/* EXISTING DOCUMENT */}

              {editingNoticeId &&
                existingNoticeDocument &&
                !removeNoticeDocument && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Existing Document
                    </label>

                    <ExistingDocumentPreview
                      document={
                        existingNoticeDocument
                      }
                      onRemove={
                        handleRemoveExistingNoticeDocument
                      }
                    />
                  </div>
                )}

              {/* NEW DOCUMENT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {editingNoticeId
                    ? "Replace Document"
                    : "Document"}
                </label>

                <DocumentPicker
                  file={noticeDocument}
                  onChange={
                    handleNoticeFileChange
                  }
                  onRemove={
                    handleRemoveNoticeFile
                  }
                  inputRef={
                    noticeFileInputRef
                  }
                  disabled={noticeSaving}
                />
              </div>

              {/* SAVE */}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={
                    handleSaveNotice
                  }
                  disabled={noticeSaving}
                  className="flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {noticeSaving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      {uploadingNoticeDocument
                        ? "Uploading..."
                        : editingNoticeId
                          ? "Updating..."
                          : "Saving..."}
                    </>
                  ) : editingNoticeId ? (
                    <>
                      <Save size={18} />
                      Update Notice
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Notice
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* NOTICE LIST */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Megaphone
                size={20}
                className="text-blue-600"
              />

              <h2 className="text-lg font-semibold text-gray-900">
                Notice List
              </h2>
            </div>

            {noticeLoading ? (
              <LoadingList />
            ) : noticeError ? (
              <ErrorState message="Failed to load notices." />
            ) : noticeList.length === 0 ? (
              <EmptyState
                icon={<Bell size={36} />}
                message="No notices found."
              />
            ) : (
              <div className="space-y-4">
                {noticeList.map(
                  (notice) => (
                    <div
                      key={
                        notice.notice_id
                      }
                      className="rounded-lg border border-gray-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                            {notice.text}
                          </p>

                          <div className="mt-2 text-xs text-gray-400">
                            {formatDate(
                              (
                                notice as any
                              )
                                .createdAt,
                            )}
                          </div>

                          <DocumentLink
                            url={
                              (
                                notice as any
                              )
                                .documentUrl
                            }
                            name={
                              (
                                notice as any
                              )
                                .documentName
                            }
                          />
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditNotice(
                                notice,
                              )
                            }
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            title="Edit notice"
                          >
                            <Edit3
                              size={18}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteType(
                                "notice",
                              );
                              setDeleteId(
                                notice.notice_id,
                              );
                            }}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            title="Delete notice"
                          >
                            <Trash2
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          DELETE MODAL
      =================================================== */}

      <DeleteConfirmationModal
        open={
          deleteType !== null &&
          deleteId !== null
        }
        title={
          deleteType === "news"
            ? "Delete News"
            : "Delete Notice"
        }
        message={
          deleteType === "news"
            ? "Are you sure you want to delete this news?"
            : "Are you sure you want to delete this notice?"
        }
        loading={
          deletingNews ||
          deletingNotice
        }
        onConfirm={
          handleConfirmDelete
        }
        onCancel={() => {
          setDeleteType(null);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default NewsNoticeManagement;

