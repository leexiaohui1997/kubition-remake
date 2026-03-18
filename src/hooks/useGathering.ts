/**
 * 采集进度条 Hook
 *
 * 封装采集进度条的定时器逻辑：先进行前置检查，通过后启动进度条，
 * 进度达到 100% 时执行采集逻辑。
 * 组件卸载时自动清除定时器。
 */

import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { isActionBusy } from '@/utils/actionGuard'
import { checkGatherRequirements, executeGather } from '@/systems/GatheringSystem'
import { GATHER_TICK_INTERVAL, GATHER_TICK_INCREMENT } from '@/constants/game'
import type { ResourceNode } from '@/types/game'

export function useGathering() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isGathering = useGameStore(state => state.isGathering)
  const startGathering = useGameStore(state => state.startGathering)
  const updateGatherProgress = useGameStore(state => state.updateGatherProgress)
  const completeGathering = useGameStore(state => state.completeGathering)
  const addLog = useGameStore(state => state.addLog)

  /** 清除定时器 */
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  /**
   * 发起采集
   * @param resource 资源节点
   */
  const gather = useCallback(
    (resource: ResourceNode) => {
      // 如果正在采集、移动或制造中，忽略
      if (isActionBusy()) return

      // 前置检查
      const checkResult = checkGatherRequirements(resource)
      if (!checkResult.canGather) {
        addLog(checkResult.reason || '无法采集', 'warning')
        return
      }

      // 记录开始采集日志
      addLog(`开始${resource.actionName}${resource.name}...`, 'info')

      // 设置采集状态
      startGathering()

      // 启动进度条定时器
      let progress = 0
      clearTimer()

      timerRef.current = setInterval(() => {
        progress += GATHER_TICK_INCREMENT
        updateGatherProgress(progress)

        if (progress >= 100) {
          // 完成采集
          clearTimer()
          completeGathering()
          executeGather(resource)
        }
      }, GATHER_TICK_INTERVAL)
    },
    [startGathering, updateGatherProgress, completeGathering, addLog, clearTimer]
  )

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    /** 发起采集 */
    gather,
    /** 是否正在采集中 */
    isGathering,
  }
}
