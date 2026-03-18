/**
 * 场景移动进度条 Hook
 *
 * 封装移动进度条的定时器逻辑：启动移动后以固定间隔递增 travelProgress，
 * 进度达到 100% 时完成移动（切换地点、推进时间、记录日志）。
 * 组件卸载时自动清除定时器。
 */

import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { getPlace, getPlaceName } from '@/data/places'
import { TRAVEL_TICK_INTERVAL, TRAVEL_TICK_INCREMENT } from '@/constants/game'

export function useTravel() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isTraveling = useGameStore(state => state.isTraveling)
  const startTravel = useGameStore(state => state.startTravel)
  const updateTravelProgress = useGameStore(state => state.updateTravelProgress)
  const completeTravel = useGameStore(state => state.completeTravel)
  const travelTo = useGameStore(state => state.travelTo)
  const advanceTime = useGameStore(state => state.advanceTime)
  const addLog = useGameStore(state => state.addLog)

  /** 清除定时器 */
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  /**
   * 发起移动
   * @param targetPlaceId 目标地点 ID
   */
  const travel = useCallback(
    (targetPlaceId: string) => {
      // 如果正在移动中，忽略重复调用
      if (useGameStore.getState().isTraveling || useGameStore.getState().isGathering) return

      const place = getPlace(targetPlaceId)
      if (!place) {
        addLog(`未知的目的地`, 'warning')
        return
      }

      // 记录出发日志
      addLog(`正在前往 ${place.name}...`, 'info')

      // 设置移动状态
      startTravel(targetPlaceId)

      // 启动进度条定时器
      let progress = 0
      clearTimer()

      timerRef.current = setInterval(() => {
        progress += TRAVEL_TICK_INCREMENT
        updateTravelProgress(progress)

        if (progress >= 100) {
          // 完成移动
          clearTimer()
          completeTravel()
          travelTo(targetPlaceId)
          advanceTime(place.timeNeed)
          addLog(`你到达了${getPlaceName(targetPlaceId)}`, 'success')
        }
      }, TRAVEL_TICK_INTERVAL)
    },
    [startTravel, updateTravelProgress, completeTravel, travelTo, advanceTime, addLog, clearTimer]
  )

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    /** 发起移动 */
    travel,
    /** 是否正在移动中 */
    isTraveling,
  }
}
