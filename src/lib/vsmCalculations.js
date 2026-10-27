// Pure calculation functions for lean metrics.
// No React, no side effects: every function takes plain data and returns a value,
// so they can be unit tested in isolation.

// Days of inventory = quantity ÷ customer demand per day.
// How many days the stock would last if the customer kept pulling at demand rate.
export function getDaysOfInventory(quantity, customerDemandPerDay) {
  if (customerDemandPerDay <= 0) return 0;
  return quantity / customerDemandPerDay;
}
