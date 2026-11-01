"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  ImagePlus,
  Plus,
  Trash2,
  GripVertical,
  Newspaper,
  School,
  Users,
  Bell,
  MapPin,
  Link as LinkIcon,
  Eye,
  Settings,
  X,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

import RecentNews from "@/components/Website/Home/RecentNews";
import SchoolHeaderSection from "@/components/Website/Home/SchoolHeader";
import NewsNoticeManagement from "@/components/Website/Home/NewsNoticeManagement";
import SchoolHistory from "@/components/Website/Home/SchoolHistory";
import SchoolLeadership from "@/components/Website/Home/SchoolLeadership";
import SliderBannerImage from "@/components/Website/Home/SliderBannerImage";


const HomePage = () => {
  const [heroSlides, setHeroSlides] = useState([
    {
      id: 1,
      title: "Welcome to Bhatiary Shishu Kanon School",
      subtitle: "Quality Education • Discipline • Morality",
      image: "",
    },
  ]);

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "",
      designation: "",
      qualification: "",
      image: "",
    },
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      title: "",
      date: "",
      type: "Notice",
      description: "",
      image: "",
    },
  ]);

  const addHeroSlide = () => {
    setHeroSlides((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        subtitle: "",
        image: "",
      },
    ]);
  };

  const removeHeroSlide = (id: number) => {
    setHeroSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const addTeacher = () => {
    setTeachers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        designation: "",
        qualification: "",
        image: "",
      },
    ]);
  };

  const removeTeacher = (id: number) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
  };

  const addNews = () => {
    setNews((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        date: "",
        type: "Notice",
        description: "",
        image: "",
      },
    ]);
  };

  const removeNews = (id: number) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  // header
  const [schoolName, setSchoolName] = useState("Bhatiary Shishu Kanon School");

  const [schoolSlogan, setSchoolSlogan] = useState(
    "Quality Education • Discipline • Morality",
  );

  const [schoolLogo, setSchoolLogo] = useState<File | null>(null);

  const [schoolLogoPreview, setSchoolLogoPreview] = useState("");

  const [isSchoolHeaderDialogOpen, setIsSchoolHeaderDialogOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Settings size={21} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Homepage Management
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage all content displayed on the school website homepage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            01. TOP HEADER
        ====================================================== */}

        <RecentNews></RecentNews>

        {/* =====================================================
            02. SCHOOL HEADER
        ====================================================== */}
        <SchoolHeaderSection></SchoolHeaderSection>

        {/* =====================================================
            03. HERO SLIDER
        ====================================================== */}
        <SliderBannerImage></SliderBannerImage>
        {/* =====================================================
            04. NOTICE & NEWS
        ====================================================== */}
    
        <NewsNoticeManagement></NewsNoticeManagement>

        {/* =====================================================
            05. SCHOOL HISTORY
        ====================================================== */}
        <SchoolHistory></SchoolHistory>

         {/* =====================================================
            05. SCHOOLLeadership
        ====================================================== */}
        <SchoolLeadership></SchoolLeadership>
       
       
   
      
        
      </div>
    </div>
  );
};

/* =========================================================
   SECTION CARD
========================================================= */

const SectionCard = ({
  number,
  icon,
  title,
  description,
  children,
  action,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* CARD HEADER */}
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-500">
                {number}
              </span>

              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>

        {action}
      </div>

      {/* CARD BODY */}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
};

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div>
      <label className="label">{label}</label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          className={`input ${icon ? "pl-10" : ""}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

/* =========================================================
   IMAGE UPLOAD
========================================================= */

const ImageUpload = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => {
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const removeImage = () => {
    setPreview("");
  };

  return (
    <div>
      <label className="label">{label}</label>

      {preview ? (
        <div
          className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${className}`}>
          <img
            src={preview}
            alt={label}
            className="h-full max-h-72 w-full object-cover"
          />

          <button
            type="button"
            onClick={removeImage}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600">
            <X size={17} />
          </button>

          <label className="absolute bottom-3 left-3 cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg">
            Change Image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      ) : (
        <label
          className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50/50 ${className}`}>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:scale-105">
            <Upload size={21} />
          </div>

          <p className="text-sm font-semibold text-slate-700">
            Click to upload image
          </p>

          <p className="mt-1 text-xs text-slate-400">PNG, JPG or WEBP</p>

          <p className="mt-1 text-[11px] text-slate-400">
            Recommended: high quality image
          </p>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
};

export default HomePage;
