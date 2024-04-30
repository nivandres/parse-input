import { expect, describe, it } from "bun:test";
import { option } from "../src/option";

describe("good use", () => {
  it("simple options", () => {
    expect(option("3")).toBe(3);
    expect(option("4")).toBe(4);
    expect(option("d")).toBe(undefined);
  });
  it("multiple options", () => {
    expect(option("3 3 3 4")).toBe(3);
    expect(option("4 3 3 3")).toBe(4);
    expect(option("d d c a")).toBe(undefined);
  });
  it("ordinary use", () => {
    expect(option("soul", ["soul"])).toBe("soul");
    expect(option("chemestry", ["soul"])).toBe(undefined);
  });
});

describe("tried to good use", () => {
  it("simple options", () => {
    expect(option("3 ")).toBe(3);
    expect(option("  3")).toBe(3);
    expect(option("3 . ")).toBe(3);
    expect(option("33")).toBe(3);
    expect(option("50")).toBe(5);
  });
});

describe("questionable use", () => {
  it("simple options", () => {
    expect(option("Please select the option 3")).toBe(3);
    expect(option("go 3.")).toBe(3);
    expect(option("3 for me")).toBe(3);
    expect(option("i want the   33")).toBe(3);
  });
  it("ordinary use", () => {
    expect(option("soul chemestry chemestry", ["soul"])).toBe("soul");
    expect(option("chemestry soul soul soul", ["soul"])).toBe("soul");
  });
});

describe("bad use", () => {
  it("simple options", () => {
    expect(option("three")).toBe(undefined);
    expect(option("iii")).toBe(undefined);
  });
});
