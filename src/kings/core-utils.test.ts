import { describe, expect, it } from "vitest";
import { asKnockoutPosition, asPosition } from "./core-utils";

describe("round-utils", () => {
  describe("asPosition", () => {
    const notTH = {
      1: "1st",
      2: "2nd",
      3: "3rd",
      21: "21st",
      22: "22nd",
      23: "23rd",
      31: "31st",
      32: "32nd",
      33: "33rd",
      41: "41st",
      42: "42nd",
      43: "43rd",
    }
    for (let i = 1; i <= 50; i++) {
      const expected = notTH[i] ?? `${i}th`
      it(`${i} as position is ${expected}`, () => {
        expect(asPosition(i)).toEqual(expected)
      })
    }
  })

  describe("asKnockoutPosition", () => {
    const notTH = {
      1: "1st/2nd",
      2: "2nd/3rd",
      3: "3rd/4th",
      20: "20th/21st",
      21: "21st/22nd",
      22: "22nd/23rd",
      23: "23rd/24th",
      30: "30th/31st",
      31: "31st/32nd",
      32: "32nd/33rd",
      33: "33rd/34th",
      40: "40th/41st",
      41: "41st/42nd",
      42: "42nd/43rd",
      43: "43rd/44th",
      50: "50th/51st",
    }

    for (let i = 1; i <= 50; i++) {
      const expected = notTH[i] ?? `${i}th/${i + 1}th`
      it(`${i} as knockout position is ${expected}`, () => {
        expect(asKnockoutPosition(i)).toEqual(expected)
      })
    }
  })
})
