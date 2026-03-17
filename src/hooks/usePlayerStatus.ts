/**
 * 玩家状态检查 Hook
 *
 * 基于常量文件中的阈值判断饥饿、口渴、体力不足等警告。
 * 使用 Zustand selector 精确订阅 player 状态，避免不必要的重渲染。
 */

import { useGameStore } from '@/stores/gameStore'
import {
  WARNING_CRITICAL_THRESHOLD,
  WARNING_LOW_THRESHOLD,
  PS_CANT_ACT_THRESHOLD,
} from '@/constants/game'

/** Hook 返回值类型 */
export interface PlayerStatusResult {
  /** 警告文本数组 */
  warnings: string[]
  /** 是否可以执行消耗体力的动作 */
  canAct: boolean
  /** 是否有任何危急警告 */
  isCritical: boolean
}

/**
 * 检查玩家当前状态，生成警告信息
 */
export function usePlayerStatus(): PlayerStatusResult {
  const player = useGameStore(state => state.player)

  const warnings: string[] = []
  let isCritical = false

  // —— 饱食度检查 ——
  if (player.full.current < WARNING_CRITICAL_THRESHOLD) {
    warnings.push('极度饥饿！生命值恢复速度下降')
    isCritical = true
  } else if (player.full.current < WARNING_LOW_THRESHOLD) {
    warnings.push('感到饥饿')
  }

  // —— 水分检查 ——
  if (player.moist.current < WARNING_CRITICAL_THRESHOLD) {
    warnings.push('极度口渴！理智值正在下降')
    isCritical = true
  } else if (player.moist.current < WARNING_LOW_THRESHOLD) {
    warnings.push('感到口渴')
  }

  // —— 体力检查 ——
  if (player.ps.current < WARNING_CRITICAL_THRESHOLD) {
    warnings.push('体力不足，需要休息')
    isCritical = true
  }

  // —— 行动能力判定 ——
  const canAct = player.ps.current > PS_CANT_ACT_THRESHOLD

  return { warnings, canAct, isCritical }
}
