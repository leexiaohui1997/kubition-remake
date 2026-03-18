/**
 * 采集系统逻辑模块
 *
 * 纯函数模块，封装采集前置检查、执行采集、使用物品等逻辑。
 * 通过调用 gameStore 的 actions 来修改状态，保持关注点分离。
 */

import { useGameStore } from '@/stores/gameStore'
import type { StatKey } from '@/stores/gameStore'
import type { ResourceNode, ItemEffect } from '@/types/game'
import { getItem, getItemName } from '@/data/items'

// ========================
// 类型定义
// ========================

/** 前置检查结果 */
export interface GatherCheckResult {
  /** 是否通过检查 */
  canGather: boolean
  /** 失败原因（仅在 canGather 为 false 时有值） */
  reason?: string
}

// ========================
// 前置检查
// ========================

/**
 * 检查采集前置条件：体力是否充足、是否持有所需工具
 */
export function checkGatherRequirements(resource: ResourceNode): GatherCheckResult {
  const state = useGameStore.getState()

  // 1. 检查体力
  const psCost = resource.psCost ?? 0
  if (psCost > 0 && state.player.ps.current < psCost) {
    return {
      canGather: false,
      reason: `体力不足，无法${resource.actionName}！`,
    }
  }

  // 2. 检查所需工具
  if (resource.requiredTool) {
    for (const [toolId, amount] of Object.entries(resource.requiredTool)) {
      if (!state.hasItem(toolId, amount)) {
        const toolName = getItemName(toolId)
        return {
          canGather: false,
          reason: `缺少工具「${toolName}」，无法${resource.actionName}！`,
        }
      }
    }
  }

  return { canGather: true }
}

// ========================
// 执行采集
// ========================

/**
 * 执行采集：消耗体力/HP、添加掉落物品到背包、生成日志、推进时间
 * 应在采集进度条完成后调用
 */
export function executeGather(resource: ResourceNode): void {
  const { consumeState, addItem, addLog, advanceTime } = useGameStore.getState()

  // 1. 消耗体力
  const psCost = resource.psCost ?? 0
  if (psCost > 0) {
    consumeState('ps', psCost)
  }

  // 2. 消耗 HP（如有）
  if (resource.hpCost && resource.hpCost > 0) {
    consumeState('hp', resource.hpCost)
  }

  // 3. 添加掉落物品到背包
  const dropNames: string[] = []
  for (const [itemId, amount] of Object.entries(resource.drops)) {
    addItem(itemId, amount)
    dropNames.push(`${getItemName(itemId)}x${amount}`)
  }

  // 4. 生成采集成功日志
  addLog(`获得了: ${dropNames.join(', ')}`, 'success')

  // 5. 推进游戏时间
  advanceTime(resource.timeCost)
}

// ========================
// 使用物品
// ========================

/** 效果属性中文名称映射 */
const EFFECT_NAME_MAP: Record<string, string> = {
  full: '饱食度',
  moist: '水分',
  hp: '生命值',
  ps: '体力',
  san: '理智',
  temp: '体温',
}

/**
 * 使用物品：读取 effect，恢复/消耗对应属性，移除物品，生成日志
 */
export function useItem(itemId: string): void {
  const { restoreState, consumeState, removeItem, addLog } = useGameStore.getState()

  const item = getItem(itemId)
  if (!item || !item.canUse || !item.effect) {
    addLog('无法使用该物品', 'warning')
    return
  }

  const effect = item.effect as ItemEffect
  const positiveEffects: string[] = []
  const negativeEffects: string[] = []

  // 遍历 effect 中的每个属性
  for (const [key, value] of Object.entries(effect)) {
    if (value === undefined || value === 0) continue

    const statKey = key as StatKey
    const effectName = EFFECT_NAME_MAP[key] || key

    if (value > 0) {
      restoreState(statKey, value)
      positiveEffects.push(`${value} 点${effectName}`)
    } else {
      // 负值效果：用 consumeState 消耗
      consumeState(statKey, Math.abs(value))
      negativeEffects.push(`${Math.abs(value)} 点${effectName}`)
    }
  }

  // 移除 1 个物品
  removeItem(itemId, 1)

  // 生成日志
  let logMessage = `使用了 ${item.name}`
  if (positiveEffects.length > 0) {
    logMessage += `，恢复了 ${positiveEffects.join('和')}`
  }
  if (negativeEffects.length > 0) {
    logMessage += `，但失去了 ${negativeEffects.join('和')}`
  }

  addLog(logMessage, 'success')
}
