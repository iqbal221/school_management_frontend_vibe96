
"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import { User, Camera, X } from "lucide-react";

interface ImageUploaderProps {
  title: string;
  preview: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface SchoolLeadershipData {
  founderName: string;
  founderDesignation: string;
  principalName: string;
  principalDesignation: string;
}

interface SchoolLeadershipProps {
  initialData?: Partial<SchoolLeadershipData>;
  onSubmit?: (
    formData: FormData
  ) => Promise<void> | void;
}

function ImageUploader({
  title,
  preview,
  inputRef,
  onChange,
  icon,
  disabled = false,
}: ImageUploaderProps) {
  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </p>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow dark:border-gray-800 dark:bg-gray-800">
          {preview ? (
            <img
              src={preview}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-500">{icon}</div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onChange}
          disabled={disabled}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Camera size={16} />
          {preview ? "Change Image" : "Upload Image"}
        </button>

        {preview && (
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = "";
              }

              const event = {
                target: {
                  files: null,
                },
              } as unknown as ChangeEvent<HTMLInputElement>;

              onChange(event);
            }}
            disabled={disabled}
            className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <X size={15} />
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

export default function SchoolLeadership({
  initialData,
  onSubmit,
}: SchoolLeadershipProps) {
  const founderInputRef = useRef<HTMLInputElement | null>(null);
  const principalInputRef = useRef<HTMLInputElement | null>(null);

  const [founderPreview, setFounderPreview] = useState("");
  const [principalPreview, setPrincipalPreview] = useState("");

  const [founderImage, setFounderImage] = useState<File | null>(null);
  const [principalImage, setPrincipalImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<SchoolLeadershipData>({
    founderName: initialData?.founderName ?? "",
    founderDesignation: initialData?.founderDesignation ?? "",
    principalName: initialData?.principalName ?? "",
    principalDesignation: initialData?.principalDesignation ?? "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFounderImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFounderImage(null);
      setFounderPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    setErrorMessage("");
    setFounderImage(file);
    setFounderPreview(URL.createObjectURL(file));
  };

  const handlePrincipalImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPrincipalImage(null);
      setPrincipalPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    setErrorMessage("");
    setPrincipalImage(file);
    setPrincipalPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetFileInputs = () => {
    if (founderInputRef.current) {
      founderInputRef.current.value = "";
    }

    if (principalInputRef.current) {
      principalInputRef.current.value = "";
    }
  };

  const handleRemoveFounderImage = () => {
    setFounderImage(null);
    setFounderPreview("");

    if (founderInputRef.current) {
      founderInputRef.current.value = "";
    }
  };

  const handleRemovePrincipalImage = () => {
    setPrincipalImage(null);
    setPrincipalPreview("");

    if (principalInputRef.current) {
      principalInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const submissionData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submissionData.append(key, value);
      });

      if (founderImage) {
        submissionData.append("founderImage", founderImage);
      }

      if (principalImage) {
        submissionData.append("principalImage", principalImage);
      }

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Connect your existing RTK Query mutation or API request here.
        console.log("School leadership form submitted.");
      }

      setSuccessMessage("School leadership information submitted.");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the information."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-950">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          School Leadership
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add or update the founder and principal information.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300"
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ImageUploader
            title="Founder Image"
            preview={founderPreview}
            inputRef={founderInputRef}
            onChange={handleFounderImageChange}
            icon={<User size={36} />}
            disabled={isSaving}
          />

          <ImageUploader
            title="Principal Image"
            preview={principalPreview}
            inputRef={principalInputRef}
            onChange={handlePrincipalImageChange}
            icon={<User size={36} />}
            disabled={isSaving}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="founderName"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Founder Name
            </label>

            <input
              id="founderName"
              name="founderName"
              value={formData.founderName}
              onChange={handleInputChange}
              placeholder="Enter founder name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="founderDesignation"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Founder Designation
            </label>

            <input
              id="founderDesignation"
              name="founderDesignation"
              value={formData.founderDesignation}
              onChange={handleInputChange}
              placeholder="e.g. Founder"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="principalName"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Principal Name
            </label>

            <input
              id="principalName"
              name="principalName"
              value={formData.principalName}
              onChange={handleInputChange}
              placeholder="Enter principal name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="principalDesignation"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Principal Designation
            </label>

            <input
              id="principalDesignation"
              name="principalDesignation"
              value={formData.principalDesignation}
              onChange={handleInputChange}
              placeholder="e.g. Principal"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
          <button
            type="button"
            onClick={() => {
              setFounderImage(null);
              setPrincipalImage(null);
              setFounderPreview("");
              setPrincipalPreview("");
              setFormData({
                founderName: "",
                founderDesignation: "",
                principalName: "",
                principalDesignation: "",
              });
              setErrorMessage("");
              setSuccessMessage("");
              resetFileInputs();
            }}
            disabled={isSaving}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Information"}
          </button>
        </div>
      </form>
    </section>
  );
}
