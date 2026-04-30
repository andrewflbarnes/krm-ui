import { flagAtomWithStorage } from "../utils/jotai-utils";

const useDeveloperFlag = flagAtomWithStorage("krm-pref-developer", "developer")
const useExperimentalFlag = flagAtomWithStorage("krm-pref-experimental", "experimental")

export const useFeatureFlags = () => {
  const [developer, setDeveloper] = useDeveloperFlag();
  const [experimental, setExperimental] = useExperimentalFlag();

  return {
    experimental,
    setExperimental,
    developer,
    setDeveloper,
  };
}
