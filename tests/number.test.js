import { describe, expect, it } from "bun:test";
import { number } from "../src/number";

describe("good use", () => {
  it("simple numbers", () => {
    expect(number("3")).toBe(3);
    expect(number("903")).toBe(903);
  });
  it("negative", () => {
    expect(number("-3")).toBe(-3);
    expect(number("-903")).toBe(-903);
  });
  it("decimal", () => {
    expect(number("3.0")).toBe(3);
    expect(number("3,0")).toBe(3);
    expect(number("903.903")).toBe(903.903);
  });
  it("multiple numbers", () => {
    expect(number("3 3")).toBe(3);
    expect(number("903 903 28")).toBe(903903.28);
    expect(number("903 904")).toBe(903904);
    expect(number("903 9")).toBe(903.9);
  });
});

describe("tried to good use", () => {
  it("simple numbers", () => {
    expect(number("I want 3")).toBe(3);
    expect(number("903 is what i need")).toBe(903);
  });
  it("negative", () => {
    expect(number("-3")).toBe(-3);
    expect(number(" -903.")).toBe(-903);
  });
  it("decimal", () => {
    expect(number("3.0000, is what happened")).toBe(3);
    expect(number("i dont know 903.903 maybe")).toBe(903.903);
  });
  it("multiple numbers", () => {
    expect(number("hello 3 bye 3 yes")).toBe(3);
    expect(number("no 903 904 yes")).toBe(903904);
  });
});

describe("questionable use", () => {
  it("simple numbers", () => {});
  it("decimal", () => {
    expect(number("0a5")).toBe(5);
  });
});

describe("bad use", () => {});
