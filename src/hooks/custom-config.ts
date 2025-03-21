import { createQuery } from "@tanstack/solid-query"
import { createMemo } from "solid-js"
import krm from "../api/krm"

export const customRoundsQueryKey = 'customRoundConfig'
export function useCustomRounds(props = {
  staleTime: 1000 * 60 * 5,
  retry: 3,
}) {
  const { staleTime, retry } = props
  const query = createQuery(() => ({
    queryKey: [customRoundsQueryKey],
    queryFn: async () => {
      return await krm.getCustomRoundConfigs()
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
  const query = createQuery(() => ({
    queryKey: [customMinileaguesQueryKey],
    queryFn: async () => {
      return await krm.getCustomMiniLeagueConfigs()
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
