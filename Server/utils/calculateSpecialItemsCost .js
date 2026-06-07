import { SPECIAL_ITEM_PRICES } from "./specialItemPricing.js";

export const calculateSpecialItemsCost = (quote) => {

  let total = 0;

  quote.specialItemsList.forEach((item) => {
    total += SPECIAL_ITEM_PRICES[item] || 0;
  });

  return total;
};