
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is SchoolERP?",
    answer:
      "SchoolERP is a school management application designed to manage students, teachers, classes, attendance, examinations, fees, and financial records in one centralized platform.",
  },
  {
    question: "Who can use SchoolERP?",
    answer:
      "SchoolERP is designed for school administrators who need an organized way to manage their school's academic and administrative activities.",
  },
  {
    question: "What administrator roles are available?",
    answer:
      "SchoolERP has two administrator roles: SUPER_ADMIN and ADMIN. Each role has different permissions based on the application's access control rules.",
  },
  {
    question: "Can I manage student and teacher information?",
    answer:
      "Yes. The application provides modules for managing student profiles, admission information, teacher details, and related records.",
  },
  {
    question: "How does attendance management work?",
    answer:
      "SchoolERP supports manual student attendance recording using two options: Present and Absent.",
  },
  {
    question: "Can I manage examinations and results?",
    answer:
      "Yes. SchoolERP provides examination management features to organize examinations and maintain student academic results.",
  },
  {
    question: "Does SchoolERP support fee and financial management?",
    answer:
      "Yes. You can manage student fee records, fee collections, school revenue, and expense information through the available modules.",
  },
  {
    question: "How can I access SchoolERP?",
    answer:
      "You can access the application through the Sign In page using an authorized administrator account.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6">

        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Frequently Asked Questions
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
            Have Questions About SchoolERP?
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Find answers to common questions about SchoolERP and
            its school management features.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-xl border transition ${
                  isOpen
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="font-semibold text-slate-800">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-blue-600 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="border-t border-slate-200 pt-4 text-sm leading-7 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
