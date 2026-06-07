import React from "react";
import QuoteSection from "./QuoteSection";
import QuoteInfoRow from "./QuoteInfoRow";

export default function QuoteMoveDetails({ quote }) {
  return (
    <div>
      <QuoteSection title="Move Details">
        <QuoteInfoRow
          label="Move Date"
          value={new Date(quote.moveDate).toLocaleString()}
        />
        <QuoteInfoRow label="From Zip" value={quote.zipFrom} />
        <QuoteInfoRow label="To Zip" value={quote.zipTo} />
        <QuoteInfoRow label="Property Size" value={quote.propertySize} />
      </QuoteSection>
    </div>
  );
}
