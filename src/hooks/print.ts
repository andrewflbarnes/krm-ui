import { createSignal } from "solid-js";

const [print, setPrint] = createSignal(false);


export const usePrint = () => [print, setPrint] as const;
