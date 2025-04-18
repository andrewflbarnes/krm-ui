import { createSignal } from "solid-js";

const searchParams = new URLSearchParams(window.location.search);
const [experimental] = createSignal(searchParams.get("experimental") === "true");

export const useFeatureFlags = () => {
  return {
    experimental,
  };
}
