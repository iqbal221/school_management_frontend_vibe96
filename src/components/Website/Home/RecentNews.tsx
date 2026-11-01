"use client";

import DeleteRecentNewConfirmationModal from "@/components/Modal/DeleteRecentNewsConfirmationModal";
import {
  useCreateRecentNewsMutation,
  useDeleteRecentNewsMutation,
  useGetRecentNewsQuery,
} from "@/redux/api/website/home/recentNewsApi";
import { Bell, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface IRecentNews {
  id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

interface IApiError {
  data?: {
    message?: string;
    errorMessages?: Array<{
      message?: string;
    }>;
  };
  message?: string;
}

const RecentNews = () => {
  // =========================
  // FORM STATE
  // =========================
  const [newsText, setNewsText] = useState("");

  // =========================
  // DELETE MODAL STATE
  // =========================
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecentNew, setDeleteRecentNew] = useState<string>("");

  // =========================
  // GET RECENT NEWS
  // =========================
  const {
    data: recentNewsResponse,
    isLoading: isRecentNewsLoading,
    isFetching: isRecentNewsFetching,
    isError: isRecentNewsError,
    refetch,
  } = useGetRecentNewsQuery();

  // =========================
  // CREATE NEWS
  // =========================
  const [createRecentNews, { isLoading: isCreating }] =
    useCreateRecentNewsMutation();

  // =========================
  // DELETE NEWS
  // =========================
  const [deleteRecentNews, { isLoading: isDeleting }] =
    useDeleteRecentNewsMutation();

  // =========================
  // DATABASE NEWS DATA
  // =========================
  const recentNews: IRecentNews[] = Array.isArray(recentNewsResponse)
    ? recentNewsResponse
    : Array.isArray((recentNewsResponse as any)?.data)
      ? (recentNewsResponse as any).data
      : [];

  // =========================
  // GET API ERROR MESSAGE
  // =========================
  const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    const apiError = error as IApiError;

    // Normal message
    if (typeof apiError?.data?.message === "string") {
      return apiError.data.message;
    }

    // Validation error messages
    if (
      Array.isArray(apiError?.data?.errorMessages) &&
      apiError.data.errorMessages.length > 0
    ) {
      const message = apiError.data.errorMessages
        .map((item) => item?.message)
        .filter(Boolean)
        .join(", ");

      if (message) {
        return message;
      }
    }

    // Axios / RTK Query message
    if (typeof apiError?.message === "string") {
      return apiError.message;
    }

    return defaultMessage;
  };

  // =========================
  // ADD NEWS
  // =========================
  const handleAddNews = async () => {
    const text = newsText.trim();

    // Empty validation
    if (!text) {
      toast.error("Please enter recent news");
      return;
    }

    // Length validation
    if (text.length > 500) {
      toast.error("Recent news cannot exceed 500 characters");
      return;
    }

    try {
      await createRecentNews({
        text,
      }).unwrap();

      // Clear input
      setNewsText("");

      toast.success("Recent news added successfully");

      // Refresh database data
      await refetch();
    } catch (error) {
      console.error("Create recent news error:", error);

      toast.error(getErrorMessage(error, "Failed to add recent news"));
    }
  };

  // =========================
  // OPEN DELETE MODAL
  // =========================
  const handleDeleteNews = (id: string) => {
    if (!id) {
      toast.error("Invalid news ID");
      return;
    }

    setDeleteRecentNew(id);
    setShowDeleteModal(true);
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Bell size={21} />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-800">Recent News</h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Add and manage running news displayed on your website.
              </p>
            </div>
          </div>

          {/* Total News */}
          <div className="hidden rounded-xl bg-slate-50 px-4 py-2 text-center sm:block">
            <p className="text-lg font-bold text-slate-800">
              {recentNews.length}
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              News
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          ADD NEWS
      ========================================================= */}
      <div className="border-b border-slate-200 p-5">
        {/* Label */}
        <div className="mb-3">
          <label
            htmlFor="recent-news"
            className="block text-sm font-semibold text-slate-700">
            Add Recent News
          </label>

          <p className="mt-1 text-xs text-slate-400">
            Enter a news message to display on your website.
          </p>
        </div>

        {/* Input + Button */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Input */}
          <div className="relative min-w-0 flex-1">
            <input
              id="recent-news"
              type="text"
              maxLength={500}
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isCreating) {
                  handleAddNews();
                }
              }}
              disabled={isCreating}
              placeholder="Admission is going on for session 2026..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Character Counter */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
              {newsText.length}/500
            </span>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddNews}
            disabled={isCreating || !newsText.trim()}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
            {isCreating ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={17} />
                Add News
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          NEWS LIST
      ========================================================= */}
      <div className="p-5">
        {/* List Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">News List</h3>

            <p className="mt-1 text-xs text-slate-400">
              {recentNews.length} news item
              {recentNews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Fetching Status */}
          {isRecentNewsFetching && !isRecentNewsLoading && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-violet-500">
              <Loader2 size={13} className="animate-spin" />
              Updating...
            </div>
          )}
        </div>

        {/* =========================================================
            LOADING
        ========================================================= */}
        {isRecentNewsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {/* Number */}
                <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200" />

                {/* Text */}
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-slate-200" />
                  <div className="h-2 w-24 rounded bg-slate-200" />
                </div>

                {/* Delete */}
                <div className="h-9 w-9 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        ) : isRecentNewsError ? (
          /* =========================================================
              ERROR STATE
          ========================================================= */
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <Bell size={30} className="mx-auto mb-3 text-red-400" />

            <p className="text-sm font-semibold text-red-600">
              Failed to load recent news
            </p>

            <p className="mt-1 text-xs text-red-400">
              Something went wrong while loading the news.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
              Try Again
            </button>
          </div>
        ) : recentNews.length === 0 ? (
          /* =========================================================
              EMPTY STATE
          ========================================================= */
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <Bell size={24} className="text-slate-400" />
            </div>

            <p className="text-sm font-semibold text-slate-600">
              No recent news found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add your first news message using the form above.
            </p>
          </div>
        ) : (
          /* =========================================================
              DATABASE NEWS LIST
          ========================================================= */
          <div className="space-y-3">
            {recentNews.map((news, index) => (
              <div
                key={news.id}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-violet-200 hover:shadow-sm">
                {/* Number */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm font-bold text-violet-600">
                  {index + 1}
                </div>

                {/* News Content */}
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium leading-5 text-slate-700">
                    {news.text}
                  </p>

                  {/* Date */}
                  {news.createdAt && (
                    <p className="mt-1 text-xs text-slate-400">
                      Added {formatDate(news.createdAt)}
                    </p>
                  )}
                </div>

                {/* Active Status */}
                {news.isActive !== undefined && (
                  <span
                    className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex ${
                      news.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                    {news.isActive ? "Active" : "Inactive"}
                  </span>
                )}

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteNews(news.id)}
                  disabled={isDeleting}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Delete news"
                  aria-label={`Delete news: ${news.text}`}>
                  {isDeleting && deleteRecentNew === news.id ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Trash2 size={17} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      <DeleteRecentNewConfirmationModal
        deleteRecentNewId={deleteRecentNew}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        isDeleting={isDeleting}
      />
    </section>
  );
};

export default RecentNews;
