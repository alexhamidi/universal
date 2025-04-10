"use client";

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is Interview Coder free?",
    answer: "No, Interview Coder requires a subscription. We offer different pricing tiers to suit your needs."
  },
  {
    question: "How is it undetectable?",
    answer: "We use advanced techniques to bypass screen recording and active tab detection. The app runs in a special mode that makes it invisible to screen sharing software."
  },
  {
    question: "What programming languages are supported?",
    answer: "We support all major programming languages including Python, JavaScript, Java, C++, and more."
  },
  {
    question: "Are languages other than English supported?",
    answer: "Yes, Interview Coder supports multiple languages including Chinese, Spanish, and more."
  },
  {
    question: "I'm experiencing a bug, what should I do",
    answer: "Please contact our support team through the help center. We'll help you resolve any issues quickly."
  },
  {
    question: "Does the app work with current Zoom versions?",
    answer: "Yes, Interview Coder works with all current versions of Zoom and other major screen sharing platforms."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 relative">
      <div className="container p-5 lg:p-0 mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="white-gradient font-inter select-none">Common Questions</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto select-none">
            Everything you need to know about Interview Coder.
          </p>
        </div>

        <div className="mx-auto rounded-2xl border border-neutral-700/40 divide-y divide-neutral-700/40 bg-neutral-900/20 backdrop-blur-xs">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-neutral-700/40 last:border-none">
              <button
                className="flex w-full items-center justify-between py-4 px-5 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-neutral-200 select-none">
                  {faq.question}
                </span>
                <span className="ml-6 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-700/50 bg-transparent">
                  <svg
                    className={`h-3 w-3 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4">
                  <p className="text-neutral-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 select-none">
          <p className="text-neutral-500">
            Have more questions? Visit our{' '}
            <a className="text-primary hover:underline" href="/help">
              help center
            </a>{' '}
            for detailed guides and support.
          </p>
        </div>
      </div>
    </section>
  );
}
