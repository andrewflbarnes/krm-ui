import { flagAtomWithStorage } from "@/utils/jotai-utils";

const useDeveloperFlag = flagAtomWithStorage("krm-pref-developer", "developer")
const useExperimentalFlag = flagAtomWithStorage("krm-pref-experimental", "experimental")
const useVerboseUiFlag = flagAtomWithStorage("krm-pref-old-man-mode", "oldmanmode")

export const useFeatureFlags = () => {
  const [developer, setDeveloper] = useDeveloperFlag();
  const [experimental, setExperimental] = useExperimentalFlag();
  const [verboseUi, setVerboseUi] = useVerboseUiFlag();

  return {
    experimental,
    setExperimental,
    developer,
    setDeveloper,
    verboseUi,
    setVerboseUi,
  };
}
