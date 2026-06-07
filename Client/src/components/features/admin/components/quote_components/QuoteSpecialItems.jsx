import React from "react";
import QuoteSection from "./QuoteSection";

const QuoteSpecialItems = ({ quote }) => {
  return (
    <QuoteSection title="Special Items">
      {quote.specialItemsList?.length > 0 && (
        <ul className="list-disc ml-5 text-slate-700">
          {quote.specialItemsList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      {quote.customItems?.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium">Custom Items</h4>

          {quote.customItems.map((item, i) => (
            <div key={i} className="text-sm text-slate-600">
              <p>{item.name}</p>

              {item.instructions && (
                <p className="text-xs">Instructions: {item.instructions}</p>
              )}

              {item.fragile && <p className="text-xs text-red-500">Fragile</p>}
            </div>
          ))}
        </div>
      )}

      {!quote.specialItemsList?.length && !quote.customItems?.length && (
        <p className="text-slate-400">No special items</p>
      )}
    </QuoteSection>
  );
};

export default QuoteSpecialItems;
