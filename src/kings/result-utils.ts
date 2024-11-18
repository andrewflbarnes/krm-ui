import { Result } from "./types"

export function orderResults(a: Result, b: Result): number {
  const tot = b.total - a.total
  if (tot !== 0) {
    return tot
  }

  const aOrd = [a.r1, a.r2, a.r3, a.r4].sort((aa, bb) => bb - aa)
  const bOrd = [b.r1, b.r2, b.r3, b.r4].sort((aa, bb) => bb - aa)
  for (let i = 0; i < aOrd.length; i++) {
    if (aOrd[i] !== bOrd[i]) {
      return bOrd[i] - aOrd[i]
    }
  }
  const aLast = [a.r4, a.r3, a.r2, a.r1]
  const bLast = [b.r4, b.r3, b.r2, b.r1]
  for (let i = 0; i < aLast.length; i++) {
    if (aLast[i] !== bLast[i]) {
      return bLast[i] - aLast[i]
    }
  }
  // TODO previous year seeding
  return -1
}
