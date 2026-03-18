/**
 * 行动互斥状态检查工具
 *
 * 提供统一的"是否正在执行某个互斥行动"检查，
 * 供 useTravel、useGathering、useCrafting 等 Hook 复用，
 * 避免在每个 Hook 中重复编写三重 if 判断。
 */

import { useGameStore } from '@/stores/gameStore'

/**
 * 检查当前是否有互斥行动正在进行（移动 / 采集 / 制造）
 *
 * @returns `true` 表示当前忙碌，不应发起新行动
 *
 * @example
 * ```ts
 * if (isActionBusy()) return
 * ```
 */
export function isActionBusy(): boolean {
  const state = useGameStore.getState()
  return state.isTraveling || state.isGathering || state.isCrafting
}
