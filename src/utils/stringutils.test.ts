import { describe, expect, it } from "vitest"
import "./stringutils"

describe("stringutils", () => {
  it("capitalises word", () => {
    expect("lowercase".capitalize()).toEqual("Lowercase")
  })
  it("capitalises first word", () => {
    expect("lowercase another".capitalize()).toEqual("Lowercase another")
  })
  it("noop on space prefix", () => {
    expect(" lowercase another".capitalize()).toEqual(" lowercase another")
  })
  it("noop on capitalized word", () => {
    expect("Already".capitalize()).toEqual("Already")
  })
  it("noop on capitalized words", () => {
    expect("Already caps".capitalize()).toEqual("Already caps")
  })
  it("noop on empty string", () => {
    expect("".capitalize()).toEqual("")
  })
  it("noop on blank string", () => {
    expect("  ".capitalize()).toEqual("  ")
  })
})
