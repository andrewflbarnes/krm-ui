import { atom, useAtom } from "solid-jotai";

const printAtom = atom(false);


export const usePrint = () => {
  const printSignal = useAtom(printAtom);
  return printSignal
}
