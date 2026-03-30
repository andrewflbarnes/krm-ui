const searchParams = new URLSearchParams(window.location.search);
const experimental = searchParams.get("experimental") === "true";
const developer = searchParams.get("developer") === "true";

export const useFeatureFlags = () => {
  return {
    experimental,
    developer,
  };
}
