/**
 * 制造系统 Hook
 *
 * 封装制造进度条的定时器逻辑：先进行前置检查，通过后启动进度条，
 * 进度达到 100% 时执行制造逻辑（扣材料、添加产出、推进时间、写日志）。
 * 组件卸载时自动清除定时器。
 */

import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { isActionBusy } from '@/utils/actionGuard'
import { getItemName } from '@/data/items'
import { GATHER_TICK_INTERVAL, GATHER_TICK_INCREMENT } from '@/constants/game'
import type { Recipe } from '@/types/game'

export function useCrafting() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isCrafting = useGameStore(state => state.isCrafting)
  const startCrafting = useGameStore(state => state.startCrafting)
  const setCraftProgress = useGameStore(state => state.setCraftProgress)
  const finishCrafting = useGameStore(state => state.finishCrafting)
  const addLog = useGameStore(state => state.addLog)

  /** 清除定时器 */
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  /**
   * 检查是否可以制造
   * @param recipe 配方
   * @returns 是否可制造及原因
   */
  const canCraft = useCallback(
    (recipe: Recipe): { ok: boolean; reason?: string } => {
      const state = useGameStore.getState()

      // 1. 互斥状态检查
      if (isActionBusy()) return { ok: false, reason: '当前正在执行其他行动' }

      // 2. 背包容量检查（物品种类数 >= maxInventory 时阻止）
      const inventorySize = Object.keys(state.inventory).length
      if (inventorySize >= state.maxInventory) {
        return { ok: false, reason: '背包已满，无法制作' }
      }

      // 3. 科技解锁检查
      if (recipe.requiredScience && !state.unlockedSciences.includes(recipe.requiredScience)) {
        return { ok: false, reason: `需要科技：${recipe.requiredScience}` }
      }

      // 4. 材料检查
      const missingMaterials: string[] = []
      for (const [itemId, amount] of Object.entries(recipe.materials)) {
        const owned = state.inventory[itemId] ?? 0
        if (owned < amount) {
          const itemName = getItemName(itemId)
          missingMaterials.push(`${itemName} x${amount - owned}`)
        }
      }
      if (missingMaterials.length > 0) {
        return { ok: false, reason: `材料不足：${missingMaterials.join('、')}` }
      }

      return { ok: true }
    },
    []
  )

  /**
   * 发起制造
   * @param recipe 配方
   */
  const startCraft = useCallback(
    (recipe: Recipe) => {
      const check = canCraft(recipe)
      if (!check.ok) {
        addLog(check.reason ?? '无法制造', 'warning')
        return
      }

      const state = useGameStore.getState()

      // 立即扣除材料
      for (const [itemId, amount] of Object.entries(recipe.materials)) {
        state.removeItem(itemId, amount)
      }

      addLog(`开始制作：${recipe.name}...`, 'info')

      // 启动制造状态
      startCrafting()

      // 根据 timeCost 等比换算进度条总 tick 数
      // 采集基准：GATHER_TICK_INCREMENT per GATHER_TICK_INTERVAL ms，100% = 50 ticks
      // 制造：timeCost 小时对应的 tick 数 = 50 * timeCost（最少 50 ticks）
      const totalTicks = Math.max(50, Math.round(50 * recipe.timeCost))
      const increment = 100 / totalTicks

      let progress = 0
      clearTimer()

      timerRef.current = setInterval(() => {
        progress += increment
        setCraftProgress(progress)

        if (progress >= 100) {
          clearTimer()
          finishCrafting()

          // 添加产出物品
          const amount = recipe.amount ?? 1
          useGameStore.getState().addItem(recipe.id, amount)

          // 推进游戏时间
          useGameStore.getState().advanceTime(recipe.timeCost)

          // 写入成功日志
          addLog(`制作完成：${recipe.name} x${amount}`, 'success')
        }
      }, GATHER_TICK_INTERVAL)
    },
    [canCraft, startCrafting, setCraftProgress, finishCrafting, addLog, clearTimer]
  )

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    /** 检查是否可以制造 */
    canCraft,
    /** 发起制造 */
    startCraft,
    /** 是否正在制造中 */
    isCrafting,
  }
}
