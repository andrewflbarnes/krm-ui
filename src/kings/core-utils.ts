/**
  * Converts betweens numbers and their equivalent positional string e.g.
  * 1 -> 1st, 2 -> 2nd, 101 -> 101st, etc.
  */
export function asPosition(num: number): string {
  const mod = num % 10
  const bigmod = num % 100
  if ([11, 12, 13].includes(bigmod) || mod > 3 || mod === 0) {
    return `${num}th`
  }
  switch (mod) {
    case 1:
      return `${num}st`
    case 2:
      return `${num}nd`
    case 3:
      return `${num}rd`
  }
}

export function asKnockoutPosition(num: number): string {
  return `${asPosition(num)}/${asPosition(num + 1)}`
}


