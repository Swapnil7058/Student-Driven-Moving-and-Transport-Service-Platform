import QuoteSection from "./QuoteSection";

export default function QuoteCustomerResponse({ quote }) {
  if (quote.status !== "rejected" && !quote.rejectionReason) {
    return null;
  }

  return (
    <QuoteSection title="Customer Response">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">Quote Rejected</p>
        <p className="mt-2 text-sm text-slate-700">
          {quote.rejectionReason || "The customer rejected this quote without a message."}
        </p>
      </div>
    </QuoteSection>
  );
}
