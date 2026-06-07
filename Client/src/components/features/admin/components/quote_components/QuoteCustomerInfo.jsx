import React from "react";
import QuoteSection from "./QuoteSection";
import QuoteInfoRow from "./QuoteInfoRow";

const QuoteCustomerInfo = ({quote}) => {
  return (
    <QuoteSection title={"Customer Information"}>
      <QuoteInfoRow label="Full Name" value={quote.fullName} />
      <QuoteInfoRow label="Email" value={quote.email} />
      <QuoteInfoRow label="Phone" value={quote.phone} />
    </QuoteSection>
  );
};

export default QuoteCustomerInfo;
