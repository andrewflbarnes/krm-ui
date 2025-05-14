import { createSignal } from "solid-js";

const searchParams = new URLSearchParams(window.location.search);
const [experimental] = createSignal(searchParams.get("experimental") === "true");
const [developer] = createSignal(searchParams.get("developer") === "true");

export const useFeatureFlags = () => {
  return {
    experimental,
    developer,
  };
}
