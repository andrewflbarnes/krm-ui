import { useQuery } from "@tanstack/solid-query"
import { createMemo } from "solid-js"
import krmEngine from "../kings/engine"

export const customRoundsQueryKey = 'customRoundConfig'
export function useCustomRounds(props = {
  staleTime: 1000 * 60 * 5,
  retry: 3,
}) {
  const { staleTime, retry } = props
  const query = useQuery(() => ({
    queryKey: [customRoundsQueryKey],
    queryFn: async () => {
      return await krmEngine.getCustomRoundConfigs()
    },
    staleTime,
    retry,
  }))
  const ext = createMemo(() => {
    return {
      configs: query.data?.configs,
      ...query,
    }
  })
  return ext
}

export const customMinileaguesQueryKey = 'customMiniLeagueConfig'
export function useCustomMinileagues(props = {
  staleTime: 1000 * 60 * 5,
  retry: 3,
}) {
  const { staleTime, retry } = props
  const query = useQuery(() => ({
    queryKey: [customMinileaguesQueryKey],
    queryFn: async () => {
      return await krmEngine.getCustomMiniLeagueConfigs()
    },
    staleTime,
    retry,
  }))
  const ext = createMemo(() => {
    return {
      configs: query.data?.configs,
      ...query,
    }
  })
  return ext
}
