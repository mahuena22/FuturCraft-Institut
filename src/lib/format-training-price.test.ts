import assert from "node:assert/strict";
import test from "node:test";
import { formatTrainingPrice } from "./format-training-price";

test("formats a multi-year formation price per year when evenly divisible", () => {
  assert.equal(formatTrainingPrice(600000, "2 ans"), "300 000 FCFA/an");
});

test("keeps the total price for shorter and one-year formations", () => {
  assert.equal(formatTrainingPrice(300000, "1 an"), "300 000 FCFA");
  assert.equal(formatTrainingPrice(150000, "3 mois"), "150 000 FCFA");
});

test("keeps the total price when an annual amount would be fractional", () => {
  assert.equal(formatTrainingPrice(500001, "2 ans"), "500 001 FCFA");
});
