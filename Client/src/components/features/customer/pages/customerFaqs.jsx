import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";



const faqs = [
  {
    question: "How do I book a moving service?",
    answer:
      "You can book a move by requesting a quote from your dashboard. Once approved, our team will contact you to confirm the booking.",
  },
  {
    question: "How much notice do I need to give before moving?",
    answer:
      "We recommend booking at least 5–7 days in advance. However, same-day and emergency moves are also available depending on availability.",
  },
  {
    question: "Are my items insured during the move?",
    answer:
      "Yes. All moves include basic insurance coverage. Additional insurance options are available upon request.",
  },
  {
    question: "Can I reschedule or cancel my move?",
    answer:
      "Yes, you can reschedule or cancel up to 24 hours before the move date without any extra charges.",
  },
  {
    question: "Do you handle long-distance moves?",
    answer:
      "Absolutely. We provide both local and long-distance moving services across multiple cities.",
  },
];

export default function CustomerFAQ() {
const navigate = useNavigate()

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 mt-2">
            Find quick answers to common questions
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50 transition"
              >
                <span className="font-medium text-slate-700">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeIndex === index && (
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 text-center text-slate-500 text-sm">
          Still have questions?  
          <span onClick={() => navigate("/customer/support")} className="text-blue-600 font-medium cursor-pointer ml-1">
            Contact Support
          </span>
        </div>
      </div>
    </div>
  );
}
