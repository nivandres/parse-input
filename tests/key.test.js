import { describe, it, expect } from "bun:test";
import { key } from "../src";

describe("simple keys", () => {
  it("good use", () => {
    expect(key("a", "a")).toBeTrue();
    expect(key("", "a")).toBeFalse();
  });
  it("bad use", () => {
    expect(key("``` a `  .,,", "a")).toBeTrue();
    expect(key("``` a `  .,,aaXd", "a")).toBeFalse();
  });
});
