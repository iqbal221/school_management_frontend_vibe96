"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Loader2,
  RotateCcw,
  Save,
  Star,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

import {
  useStudentsQuery,
  useUploadResultWithFormDataMutation,
} from "@/redux/api/studentApi";

/* ================================================================
   TYPES
================================================================ */

interface ResultFormData {
  name: string;
  admission: string;
  roll: string;

  banglaMarks: string;
  banglaGrade: string;

  englishMarks: string;
  englishGrade: string;

  mathematicsMarks: string;
  mathematicsGrade: string;

  scienceMarks: string;
  scienceGrade: string;

  religiousMarks: string;
  religiousGrade: string;

  point: string;
  grade: string;
}

interface Student {
  _id?: string;
  id?: string;
  name?: string;
  admission?: string | number;
  roll?: string | number;
}

interface GradeInfo {
  grade: string;
  point: number;
}

/* ================================================================
   IMPORTED RESULT TYPE
================================================================ */

interface ImportedResult {
  name: string;
  admission: string;
  roll: string;

  banglaMarks?: string;
  englishMarks?: string;
  mathematicsMarks?: string;
  scienceMarks?: string;
  religiousMarks?: string;
}

/* ================================================================
   INITIAL FORM
================================================================ */

const initialFormData: ResultFormData = {
  name: "",
  admission: "",
  roll: "",

  banglaMarks: "",
  banglaGrade: "",

  englishMarks: "",
  englishGrade: "",

  mathematicsMarks: "",
  mathematicsGrade: "",

  scienceMarks: "",
  scienceGrade: "",

  religiousMarks: "",
  religiousGrade: "",

  point: "",
  grade: "",
};

/* ================================================================
   GRADE CALCULATION
================================================================ */

const getGradeInfo = (marks: number): GradeInfo => {
  if (marks >= 80) return { grade: "A+", point: 5.0 };
  if (marks >= 70) return { grade: "A", point: 4.0 };
  if (marks >= 60) return { grade: "A-", point: 3.5 };
  if (marks >= 50) return { grade: "B", point: 3.0 };
  if (marks >= 40) return { grade: "C", point: 2.0 };
  if (marks >= 33) return { grade: "D", point: 1.0 };

  return { grade: "F", point: 0 };
};

/* ================================================================
   OVERALL GRADE
================================================================ */

const getOverallGrade = (point: number): string => {
  if (point >= 5) return "A+";
  if (point >= 4) return "A";
  if (point >= 3.5) return "A-";
  if (point >= 3) return "B";
  if (point >= 2) return "C";
  if (point >= 1) return "D";

  return "F";
};

/* ================================================================
   NORMALIZE HEADER
================================================================ */

const normalizeHeader = (value: unknown): string => {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-./()]+/g, "");
};

/* ================================================================
   FIND COLUMN
================================================================ */

const findColumn = (
  row: Record<string, unknown>,
  aliases: string[],
): string | undefined => {
  const normalizedAliases = aliases.map(normalizeHeader);

  return Object.keys(row).find((key) =>
    normalizedAliases.includes(normalizeHeader(key)),
  );
};

/* ================================================================
   GET VALUE FROM ROW
================================================================ */

const getRowValue = (
  row: Record<string, unknown>,
  aliases: string[],
): string => {
  const key = findColumn(row, aliases);

  if (!key) return "";

  return String(row[key] ?? "").trim();
};

/* ================================================================
   PARSE IMPORTED ROW
================================================================ */

const parseImportedRow = (
  row: Record<string, unknown>,
): ImportedResult | null => {
  const name = getRowValue(row, [
    "name",
    "studentname",
    "student",
    "student_name",
  ]);

  const admission = getRowValue(row, [
    "admission",
    "class",
    "classname",
    "class_name",
  ]);

  const roll = getRowValue(row, [
    "roll",
    "rollnumber",
    "rollno",
    "roll_number",
  ]);

  if (!name && !roll) {
    return null;
  }

  return {
    name,
    admission,
    roll,

    banglaMarks: getRowValue(row, [
      "bangla",
      "banglamarks",
      "banglanumber",
      "banglascore",
      "bangla_mark",
      "bangla_marks",
    ]),

    englishMarks: getRowValue(row, [
      "english",
      "englishmarks",
      "englishnumber",
      "englishscore",
      "english_mark",
      "english_marks",
    ]),

    mathematicsMarks: getRowValue(row, [
      "mathematics",
      "math",
      "maths",
      "mathematicsmarks",
      "mathmarks",
      "mathematicscore",
      "mathscore",
    ]),

    scienceMarks: getRowValue(row, [
      "science",
      "sciencemarks",
      "sciencescore",
      "science_mark",
      "science_marks",
    ]),

    religiousMarks: getRowValue(row, [
      "religious",
      "religiousstudies",
      "religiousmarks",
      "religiousstudiesmarks",
      "religion",
      "religionmarks",
      "religious_score",
    ]),
  };
};

/* ================================================================
   PAGE
================================================================ */

const ResultUploadPage = () => {
  const [formData, setFormData] = useState<ResultFormData>(initialFormData);

  const [importedResults, setImportedResults] = useState<ImportedResult[]>([]);

  const [importedFileName, setImportedFileName] = useState("");

  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================================================================
     STUDENTS
  ================================================================ */

  const query = {
    limit: 100,
    page: 1,
    sortBy: "",
    sortOrder: "",
  };

  const { data, isLoading } = useStudentsQuery(query);

  const studentData: Student[] = data?.students || [];

  /* ================================================================
     UPLOAD MUTATION
  ================================================================ */

  const [uploadResultWithFormData, { isLoading: isUploading }] =
    useUploadResultWithFormDataMutation();

  /* ================================================================
     UNIQUE STUDENT NAMES
  ================================================================ */

  const studentUniqueName = useMemo(() => {
    return Array.from(
      new Set(
        studentData
          .map((student) => student?.name)
          .filter((name): name is string => Boolean(name && name.trim())),
      ),
    );
  }, [studentData]);

  /* ================================================================
     AVAILABLE CLASSES
  ================================================================ */

  const availableClasses = useMemo(() => {
    if (!formData.name) return [];

    return Array.from(
      new Set(
        studentData
          .filter((student) => student?.name === formData.name)
          .map((student) => student?.admission)
          .filter(
            (value): value is string | number =>
              value !== undefined && value !== null,
          )
          .map(String),
      ),
    );
  }, [studentData, formData.name]);

  /* ================================================================
     AVAILABLE ROLLS
  ================================================================ */

  const availableRolls = useMemo(() => {
    if (!formData.name || !formData.admission) {
      return [];
    }

    return Array.from(
      new Set(
        studentData
          .filter(
            (student) =>
              student?.name === formData.name &&
              String(student?.admission) === String(formData.admission),
          )
          .map((student) => student?.roll)
          .filter(
            (value): value is string | number =>
              value !== undefined && value !== null,
          )
          .map(String),
      ),
    );
  }, [studentData, formData.name, formData.admission]);

  /* ================================================================
     SELECTED STUDENT
  ================================================================ */

  const selectedStudent = useMemo(() => {
    return studentData.find(
      (student) =>
        student?.name === formData.name &&
        String(student?.admission) === String(formData.admission) &&
        String(student?.roll) === String(formData.roll),
    );
  }, [studentData, formData.name, formData.admission, formData.roll]);

  /* ================================================================
     APPLY IMPORTED RESULT
  ================================================================ */

  const applyImportedResult = (
    imported: ImportedResult,
    base: ResultFormData,
  ): ResultFormData => {
    const next = {
      ...base,

      banglaMarks: imported.banglaMarks || "",
      englishMarks: imported.englishMarks || "",
      mathematicsMarks: imported.mathematicsMarks || "",
      scienceMarks: imported.scienceMarks || "",
      religiousMarks: imported.religiousMarks || "",
    };

    const subjects = [
      {
        marks: imported.banglaMarks,
        grade: "banglaGrade" as keyof ResultFormData,
      },
      {
        marks: imported.englishMarks,
        grade: "englishGrade" as keyof ResultFormData,
      },
      {
        marks: imported.mathematicsMarks,
        grade: "mathematicsGrade" as keyof ResultFormData,
      },
      {
        marks: imported.scienceMarks,
        grade: "scienceGrade" as keyof ResultFormData,
      },
      {
        marks: imported.religiousMarks,
        grade: "religiousGrade" as keyof ResultFormData,
      },
    ];

    subjects.forEach(({ marks, grade }) => {
      if (!marks) {
        next[grade] = "";
        return;
      }

      const numericMarks = Number(marks);

      if (
        Number.isFinite(numericMarks) &&
        numericMarks >= 0 &&
        numericMarks <= 100
      ) {
        next[grade] = getGradeInfo(numericMarks).grade;
      } else {
        next[grade] = "";
      }
    });

    return next;
  };

  /* ================================================================
     FIND IMPORTED STUDENT
  ================================================================ */

  const findImportedStudent = (
    name: string,
    admission: string,
    roll: string,
  ) => {
    if (!importedResults.length) return null;

    const normalizedName = name.trim().toLowerCase();

    const exact = importedResults.find(
      (item) =>
        item.name.trim().toLowerCase() === normalizedName &&
        String(item.admission).trim() === String(admission).trim() &&
        String(item.roll).trim() === String(roll).trim(),
    );

    if (exact) return exact;

    const rollMatch = importedResults.find(
      (item) =>
        String(item.roll).trim() === String(roll).trim() &&
        item.name.trim().toLowerCase() === normalizedName,
    );

    return rollMatch || null;
  };

  /* ================================================================
     AUTO APPLY IMPORTED MARKS
  ================================================================ */

  const autoApplyImportedResult = (
    name: string,
    admission: string,
    roll: string,
  ) => {
    const imported = findImportedStudent(name, admission, roll);

    if (!imported) return;

    setFormData((prev) => applyImportedResult(imported, prev));

    toast.success(`Marks imported automatically for ${name}`);
  };

  /* ================================================================
     HANDLE CHANGE
  ================================================================ */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      /* ------------------------------------------------------------
         STUDENT NAME
      ------------------------------------------------------------ */

      if (name === "name") {
        return {
          ...prev,
          name: value,
          admission: "",
          roll: "",
          banglaMarks: "",
          banglaGrade: "",
          englishMarks: "",
          englishGrade: "",
          mathematicsMarks: "",
          mathematicsGrade: "",
          scienceMarks: "",
          scienceGrade: "",
          religiousMarks: "",
          religiousGrade: "",
        };
      }

      /* ------------------------------------------------------------
         CLASS
      ------------------------------------------------------------ */

      if (name === "admission") {
        return {
          ...prev,
          admission: value,
          roll: "",
          banglaMarks: "",
          banglaGrade: "",
          englishMarks: "",
          englishGrade: "",
          mathematicsMarks: "",
          mathematicsGrade: "",
          scienceMarks: "",
          scienceGrade: "",
          religiousMarks: "",
          religiousGrade: "",
        };
      }

      /* ------------------------------------------------------------
         ROLL
      ------------------------------------------------------------ */

      if (name === "roll") {
        const next = {
          ...prev,
          roll: value,
        };

        const imported = findImportedStudent(prev.name, prev.admission, value);

        if (imported) {
          return applyImportedResult(imported, next);
        }

        return next;
      }

      /* ------------------------------------------------------------
         MARKS → AUTOMATIC GRADE
      ------------------------------------------------------------ */

      const marksToGrade: Record<string, keyof ResultFormData> = {
        banglaMarks: "banglaGrade",
        englishMarks: "englishGrade",
        mathematicsMarks: "mathematicsGrade",
        scienceMarks: "scienceGrade",
        religiousMarks: "religiousGrade",
      };

      if (marksToGrade[name]) {
        const gradeField = marksToGrade[name];

        if (value === "") {
          return {
            ...prev,
            [name]: "",
            [gradeField]: "",
          };
        }

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
          return {
            ...prev,
            [name]: value,
            [gradeField]: "",
          };
        }

        const safeMarks = Math.min(100, Math.max(0, numericValue));

        const gradeInfo = getGradeInfo(safeMarks);

        return {
          ...prev,
          [name]: String(safeMarks),
          [gradeField]: gradeInfo.grade,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  /* ================================================================
     EXCEL IMPORT
  ================================================================ */

  const importExcel = async (file: File) => {
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error("Excel sheet not found");
    }

    const worksheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
    });

    const results = rows
      .map(parseImportedRow)
      .filter((item): item is ImportedResult => Boolean(item));

    if (!results.length) {
      throw new Error("No valid student result data found in Excel file.");
    }

    return results;
  };

  /* ================================================================
     WORD IMPORT
  ================================================================ */

  const importWord = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
      arrayBuffer,
    });

    const text = result.value.trim();

    if (!text) {
      throw new Error("No readable text found in Word file.");
    }

    /*
      Supported Word text format:

      Name | Class | Roll | Bangla | English | Mathematics | Science | Religious
      Rahim | 6 | 1 | 85 | 78 | 90 | 82 | 88
      Karim | 6 | 2 | 72 | 65 | 75 | 70 | 80
    */

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new Error("Word file must contain a header and student rows.");
    }

    const separator = lines[0].includes("\t")
      ? "\t"
      : lines[0].includes("|")
        ? "|"
        : ",";

    const headers = lines[0].split(separator).map((header) => header.trim());

    const rows: Record<string, unknown>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(separator).map((value) => value.trim());

      const row: Record<string, unknown> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] ?? "";
      });

      rows.push(row);
    }

    const results = rows
      .map(parseImportedRow)
      .filter((item): item is ImportedResult => Boolean(item));

    if (!results.length) {
      throw new Error("No valid student result data found in Word file.");
    }

    return results;
  };

  /* ================================================================
     FILE UPLOAD
  ================================================================ */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsImporting(true);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();

      let results: ImportedResult[] = [];

      if (extension === "xlsx" || extension === "xls") {
        results = await importExcel(file);
      } else if (extension === "docx") {
        results = await importWord(file);
      } else {
        throw new Error(
          "Please upload an Excel (.xlsx/.xls) or Word (.docx) file.",
        );
      }

      setImportedResults(results);
      setImportedFileName(file.name);

      toast.success(
        `${results.length} student result(s) imported successfully.`,
      );

      /*
        If student is already selected,
        immediately import that student&rsquo;s marks.
      */

      if (formData.name && formData.admission && formData.roll) {
        const imported = results.find(
          (item) =>
            item.name.trim().toLowerCase() ===
            formData.name.trim().toLowerCase() &&
            String(item.admission).trim() ===
            String(formData.admission).trim() &&
            String(item.roll).trim() === String(formData.roll).trim(),
        );

        if (imported) {
          setFormData((prev) => applyImportedResult(imported, prev));
        }
      }
    } catch (error: any) {
      console.error("Import error:", error);

      toast.error(error?.message || "Failed to import result file.");

      setImportedResults([]);
      setImportedFileName("");
    } finally {
      setIsImporting(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* ================================================================
     REMOVE IMPORTED FILE
  ================================================================ */

  const removeImportedFile = () => {
    setImportedResults([]);
    setImportedFileName("");

    toast.info("Imported result data cleared.");
  };

  /* ================================================================
     FINAL RESULT
  ================================================================ */

  const subjectMarks = useMemo(
    () => [
      {
        name: "Bangla",
        marks: formData.banglaMarks,
        grade: formData.banglaGrade,
      },
      {
        name: "English",
        marks: formData.englishMarks,
        grade: formData.englishGrade,
      },
      {
        name: "Mathematics",
        marks: formData.mathematicsMarks,
        grade: formData.mathematicsGrade,
      },
      {
        name: "Science",
        marks: formData.scienceMarks,
        grade: formData.scienceGrade,
      },
      {
        name: "Religious Studies",
        marks: formData.religiousMarks,
        grade: formData.religiousGrade,
      },
    ],
    [
      formData.banglaMarks,
      formData.banglaGrade,
      formData.englishMarks,
      formData.englishGrade,
      formData.mathematicsMarks,
      formData.mathematicsGrade,
      formData.scienceMarks,
      formData.scienceGrade,
      formData.religiousMarks,
      formData.religiousGrade,
    ],
  );

  const finalResult = useMemo(() => {
    const validSubjects = subjectMarks.filter(
      (subject) =>
        subject.marks.trim() !== "" && Number.isFinite(Number(subject.marks)),
    );

    const completedSubjects = validSubjects.length;

    if (!completedSubjects) {
      return {
        total: 0,
        average: 0,
        point: 0,
        grade: "",
        completedSubjects: 0,
        isComplete: false,
        hasFailed: false,
      };
    }

    const marks = validSubjects.map((subject) => Number(subject.marks));

    const total = marks.reduce((sum, mark) => sum + mark, 0);

    const average = total / completedSubjects;

    const totalPoint = marks.reduce(
      (sum, mark) => sum + getGradeInfo(mark).point,
      0,
    );

    const point = totalPoint / completedSubjects;

    const hasFailed = marks.some((mark) => mark < 33);

    const grade = hasFailed ? "F" : getOverallGrade(point);

    return {
      total,
      average,
      point,
      grade,
      completedSubjects,
      isComplete: completedSubjects === 5,
      hasFailed,
    };
  }, [subjectMarks]);

  /* ================================================================
     RESET
  ================================================================ */

  const handleReset = () => {
    setFormData({
      ...initialFormData,
    });

    setImportedResults([]);
    setImportedFileName("");

    toast.info("Form reset.");
  };

  /* ================================================================
     SUBMIT
  ================================================================ */

  const handleResultUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please select student name");
      return;
    }

    if (!formData.admission.trim()) {
      toast.error("Please select class");
      return;
    }

    if (!formData.roll.trim()) {
      toast.error("Please select roll number");
      return;
    }

    const subjects = [
      {
        name: "Bangla",
        marks: formData.banglaMarks,
      },
      {
        name: "English",
        marks: formData.englishMarks,
      },
      {
        name: "Mathematics",
        marks: formData.mathematicsMarks,
      },
      {
        name: "Science",
        marks: formData.scienceMarks,
      },
      {
        name: "Religious Studies",
        marks: formData.religiousMarks,
      },
    ];

    for (const subject of subjects) {
      if (!subject.marks.trim()) {
        toast.error(`Please enter ${subject.name} marks`);
        return;
      }

      const marks = Number(subject.marks);

      if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        toast.error(`${subject.name} marks must be between 0 and 100`);
        return;
      }
    }

    if (!finalResult.isComplete) {
      toast.error("Please enter marks for all subjects.");
      return;
    }

    const resultData = {
      name: formData.name.trim(),
      admission: formData.admission,
      roll: formData.roll,

      banglaMarks: Number(formData.banglaMarks),
      banglaGrade: formData.banglaGrade,

      englishMarks: Number(formData.englishMarks),
      englishGrade: formData.englishGrade,

      mathematicsMarks: Number(formData.mathematicsMarks),
      mathematicsGrade: formData.mathematicsGrade,

      scienceMarks: Number(formData.scienceMarks),
      scienceGrade: formData.scienceGrade,

      religiousMarks: Number(formData.religiousMarks),
      religiousGrade: formData.religiousGrade,

      point: finalResult.point.toFixed(2),
      grade: finalResult.grade,
    };

    try {
      await uploadResultWithFormData(resultData).unwrap();

      toast.success("Result uploaded successfully!");

      setFormData({
        ...initialFormData,
      });
    } catch (error: any) {
      console.error("Result upload error:", error);

      toast.error(
        error?.data?.message || error?.message || "Result upload failed",
      );
    }
  };

  /* ================================================================
     UI
  ================================================================ */

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                  Upload  Result
                </h1>
              </div>
            </div>


            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Users className="h-4 w-4 text-slate-400" />

                <span className="text-xs font-semibold text-slate-600">
                  Students: {studentData.length}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================
            IMPORT FILE
        ====================================================== */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* EXCEL */}

              <label
                htmlFor="result-file"
                className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-5 transition hover:border-emerald-400 hover:bg-emerald-50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">Excel Result File</p>

                  <p className="mt-1 text-xs text-slate-500">.xlsx or .xls</p>

                  <p className="mt-2 text-[11px] text-emerald-600">
                    Name → Class → Roll → Subjects
                  </p>
                </div>

                <Upload className="h-5 w-5 text-slate-300 transition group-hover:text-emerald-500" />
              </label>

              {/* WORD */}

              <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">Word Result File</p>

                  <p className="mt-1 text-xs text-slate-500">.docx</p>

                  <p className="mt-2 text-[11px] text-blue-600">
                    Supports pipe, tab or comma separated data.
                  </p>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              id="result-file"
              type="file"
              accept=".xlsx,.xls,.docx"
              onChange={handleFileUpload}
              disabled={isImporting || isUploading}
              className="hidden"
            />

            {/* IMPORT STATUS */}

            {isImporting && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-sky-600" />

                <div>
                  <p className="text-sm font-bold text-sky-700">
                    Reading result file...
                  </p>

                  <p className="text-xs text-sky-500">Please wait.</p>
                </div>
              </div>
            )}

            {importedFileName && !isImporting && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                  <div>
                    <p className="text-sm font-bold text-emerald-700">
                      {importedFileName}
                    </p>

                    <p className="text-xs text-emerald-600">
                      {importedResults.length} student result(s) loaded
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeImportedFile}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                  <X className="h-4 w-4" />
                  Clear File
                </button>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-600">
                Recommended Excel columns
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Name, Class, Roll, Bangla, English, Mathematics, Science,
                Religious Studies
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleResultUpload}>
          {/* ====================================================
              STUDENT INFORMATION
          ==================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Student Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Select student, class and roll.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <SelectField
                  label="Student Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<UserRound className="h-4 w-4" />}
                  placeholder={
                    isLoading ? "Loading students..." : "Select student"
                  }
                  options={studentUniqueName}
                  disabled={isLoading || isUploading}
                />

                <SelectField
                  label="Class"
                  name="admission"
                  value={formData.admission}
                  onChange={handleChange}
                  icon={<BookOpen className="h-4 w-4" />}
                  placeholder={
                    formData.name ? "Select class" : "Select student first"
                  }
                  options={availableClasses}
                  disabled={!formData.name || isUploading}
                />

                <SelectField
                  label="Roll Number"
                  name="roll"
                  value={formData.roll}
                  onChange={handleChange}
                  icon={<Users className="h-4 w-4" />}
                  placeholder={
                    formData.admission ? "Select roll" : "Select class first"
                  }
                  options={availableRolls}
                  disabled={!formData.admission || isUploading}
                />
              </div>

              {selectedStudent && (
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          Selected Student
                        </p>

                        <p className="font-bold text-slate-800">
                          {selectedStudent.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <InfoBadge
                        label="Class"
                        value={String(selectedStudent.admission ?? "—")}
                      />

                      <InfoBadge
                        label="Roll"
                        value={String(selectedStudent.roll ?? "—")}
                      />

                      {findImportedStudent(
                        formData.name,
                        formData.admission,
                        formData.roll,
                      ) && <InfoBadge label="Import" value="Marks Loaded" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ====================================================
              SUBJECT RESULTS
          ==================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">Subject Results</h2>

                  <p className="text-xs text-slate-500">
                    Marks can be imported automatically or entered manually.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-3">
              <SubjectCard
                title="Bangla"
                icon="বাং"
                description="Bangla Language"
                marksName="banglaMarks"
                gradeName="banglaGrade"
                marksValue={formData.banglaMarks}
                gradeValue={formData.banglaGrade}
                onChange={handleChange}
                disabled={isUploading}
              />

              <SubjectCard
                title="English"
                icon="EN"
                description="English Language"
                marksName="englishMarks"
                gradeName="englishGrade"
                marksValue={formData.englishMarks}
                gradeValue={formData.englishGrade}
                onChange={handleChange}
                disabled={isUploading}
              />

              <SubjectCard
                title="Mathematics"
                icon="∑"
                description="Mathematics"
                marksName="mathematicsMarks"
                gradeName="mathematicsGrade"
                marksValue={formData.mathematicsMarks}
                gradeValue={formData.mathematicsGrade}
                onChange={handleChange}
                disabled={isUploading}
              />

              <SubjectCard
                title="Science"
                icon="⚗"
                description="General Science"
                marksName="scienceMarks"
                gradeName="scienceGrade"
                marksValue={formData.scienceMarks}
                gradeValue={formData.scienceGrade}
                onChange={handleChange}
                disabled={isUploading}
              />

              <SubjectCard
                title="Religious Studies"
                icon="★"
                description="Religious Education"
                marksName="religiousMarks"
                gradeName="religiousGrade"
                marksValue={formData.religiousMarks}
                gradeValue={formData.religiousGrade}
                onChange={handleChange}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* ====================================================
              FINAL RESULT
          ==================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 via-white to-emerald-50 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Award className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">Final Result</h2>

                  <p className="text-xs text-slate-500">
                    Automatically calculated from subject marks.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryCard
                  label="Total Marks"
                  value={String(finalResult.total)}
                  suffix={finalResult.isComplete ? "/ 500" : ""}
                  icon={<BookOpen className="h-4 w-4" />}
                  variant="slate"
                />

                <SummaryCard
                  label="Average Marks"
                  value={
                    finalResult.average ? finalResult.average.toFixed(2) : "—"
                  }
                  icon={<Star className="h-4 w-4" />}
                  variant="sky"
                />

                <SummaryCard
                  label="Subjects Completed"
                  value={String(finalResult.completedSubjects)}
                  suffix="/ 5"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  variant="indigo"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* GPA */}

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <Star className="h-4 w-4 text-amber-500" />
                    Grade Point
                  </label>

                  <div className="flex h-14 items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4">
                    <span className="text-xs font-semibold text-amber-600">
                      GPA
                    </span>

                    <span className="text-2xl font-extrabold text-amber-700">
                      {finalResult.isComplete
                        ? finalResult.point.toFixed(2)
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* GRADE */}

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <Award className="h-4 w-4 text-emerald-500" />
                    Overall Grade
                  </label>

                  <div
                    className={`flex h-14 items-center justify-between rounded-xl border px-4 ${finalResult.grade === "F"
                      ? "border-red-200 bg-red-50"
                      : "border-emerald-200 bg-emerald-50"
                      }`}>
                    <span className="text-xs font-semibold text-slate-500">
                      FINAL GRADE
                    </span>

                    <span
                      className={`text-2xl font-extrabold ${finalResult.grade === "F"
                        ? "text-red-700"
                        : "text-emerald-700"
                        }`}>
                      {finalResult.isComplete ? finalResult.grade : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`mt-5 flex items-center gap-3 rounded-xl border p-4 ${finalResult.isComplete
                  ? finalResult.hasFailed
                    ? "border-red-100 bg-red-50"
                    : "border-emerald-100 bg-emerald-50"
                  : "border-amber-100 bg-amber-50"
                  }`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  {finalResult.isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Star className="h-5 w-5 text-amber-600" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {finalResult.isComplete
                      ? finalResult.hasFailed
                        ? "Student has failed"
                        : "Final result is ready"
                      : "Enter all subject marks"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {finalResult.isComplete
                      ? `GPA ${finalResult.point.toFixed(2)} • Grade ${finalResult.grade
                      }`
                      : "GPA and overall grade will be calculated automatically."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================
              ACTION BAR
          ==================================================== */}

          <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">
                  Ready to upload result?
                </p>

                <p className="text-xs text-slate-400">
                  Imported marks and final result are calculated automatically.
                </p>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isUploading || isImporting}
                  className="flex h-11 flex-1 items-center justify-center gap-2 border border-slate-300 bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={
                    isUploading ||
                    isLoading ||
                    isImporting ||
                    !finalResult.isComplete
                  }
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-7 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Upload Result
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ================================================================
   SELECT FIELD
================================================================ */

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  options: any[];
  icon: React.ReactNode;
  disabled?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const SelectField = ({
  label,
  name,
  value,
  placeholder,
  options,
  icon,
  disabled,
  onChange,
}: SelectFieldProps) => {
  return (
    <div className="w-full">
      <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        <span className="text-sky-500">{icon}</span>
        {label}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-12 w-full appearance-none border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400">
          <option value="">{placeholder}</option>

          {options.map((option, index) => (
            <option
              key={`${name}-${String(option)}-${index}`}
              value={String(option)}>
              {String(option)}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
};

/* ================================================================
   SUBJECT CARD
================================================================ */

interface SubjectCardProps {
  title: string;
  icon: string;
  description: string;
  marksName: string;
  gradeName: string;
  marksValue: string;
  gradeValue: string;
  disabled?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const SubjectCard = ({
  title,
  icon,
  description,
  marksName,
  gradeName,
  marksValue,
  gradeValue,
  disabled,
  onChange,
}: SubjectCardProps) => {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-sky-200 hover:bg-sky-50/30 hover:shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-extrabold text-sky-600 shadow-sm ring-1 ring-slate-200">
            {icon}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>

            <p className="text-[11px] text-slate-400">{description}</p>
          </div>
        </div>

        <BookOpen className="h-4 w-4 text-slate-300 transition group-hover:text-sky-400" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* MARKS */}

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Marks
          </label>

          <input
            type="text"
            name={marksName}
            value={marksValue}
            onChange={onChange}
            placeholder="0 - 100"
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-300 hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>

        {/* GRADE */}

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Auto Grade
          </label>

          <div
            className={`flex h-12 items-center justify-between rounded-xl border px-4 ${gradeValue === "F"
              ? "border-red-200 bg-red-50"
              : gradeValue
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-slate-100"
              }`}>
            <span className="text-xs text-slate-400">Grade</span>

            <span
              className={`text-base font-extrabold ${gradeValue === "F"
                ? "text-red-600"
                : gradeValue
                  ? "text-emerald-600"
                  : "text-slate-300"
                }`}>
              {gradeValue || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   SUMMARY CARD
================================================================ */

interface SummaryCardProps {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
  variant: "slate" | "sky" | "indigo";
}

const SummaryCard = ({
  label,
  value,
  suffix,
  icon,
  variant,
}: SummaryCardProps) => {
  const styles = {
    slate: {
      wrapper: "border-slate-200 bg-slate-50",
      icon: "bg-white text-slate-500",
      label: "text-slate-400",
      value: "text-slate-800",
    },

    sky: {
      wrapper: "border-sky-100 bg-sky-50",
      icon: "bg-white text-sky-500",
      label: "text-sky-500",
      value: "text-sky-700",
    },

    indigo: {
      wrapper: "border-indigo-100 bg-indigo-50",
      icon: "bg-white text-indigo-500",
      label: "text-indigo-500",
      value: "text-indigo-700",
    },
  };

  const current = styles[variant];

  return (
    <div className={`rounded-xl border p-4 ${current.wrapper}`}>
      <div className="flex items-center justify-between">
        <p
          className={`text-[10px] font-bold uppercase tracking-wider ${current.label}`}>
          {label}
        </p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${current.icon}`}>
          {icon}
        </div>
      </div>

      <p className={`mt-2 text-2xl font-extrabold ${current.value}`}>
        {value}

        {suffix && (
          <span className="ml-1 text-sm font-medium opacity-50">{suffix}</span>
        )}
      </p>
    </div>
  );
};

/* ================================================================
   INFO BADGE
================================================================ */

const InfoBadge = ({ label, value }: { label: string; value: string }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-white px-3 py-1.5 text-xs">
      <span className="font-semibold text-slate-400">{label}:</span>

      <span className="font-bold text-emerald-700">{value}</span>
    </span>
  );
};

export default ResultUploadPage;
