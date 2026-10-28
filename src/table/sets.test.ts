import { describe, expect, it } from "vitest";
import type { Path } from "../content/types";
import { pathTypes } from "./sets";

const path = (type: Path["type"]): Path => ({ from: "a", to: "b", type });

describe("pathTypes", () => {
  it("keeps the legend order and drops absent types", () => {
    expect(pathTypes([path("uncharted"), path("train"), path("train")])).toEqual(["train", "uncharted"]);
  });
  it("is empty without paths", () => {
    expect(pathTypes([])).toEqual([]);
  });
});
