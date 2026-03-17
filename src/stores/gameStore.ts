/**
 * 游戏全局状态管理 Store
 *
 * 基于 Zustand 实现，管理游戏时间、玩家属性、背包、装备、地点和日志。
 * 使用 persist 中间件实现 localStorage 持久化。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlayerState, PlayerEquipment } from '@/types/player'
import {
  MAX_STATE,
  INITIAL_FULL,
  INITIAL_MOIST,
  TEMP_COMFORTABLE,
  TEMP_MAX,
  TEMP_MIN,
  BAG_BASE_SIZE,
  INITIAL_PLACE,
  LOG_MAX_COUNT,
  FULL_DESC_PER_HOUR,
  MOIST_DESC_PER_HOUR,
  PS_RECOVER_PER_HOUR,
} from '@/constants/game'

// ========================
// 类型定义
// ========================

/** 日志类型 */
export type LogType = 'info' | 'success' | 'warning' | 'error'

/** 游戏日志条目 */
export interface GameLog {
  /** 日志产生时的游戏小时数 */
  time: number
  /** 日志消息内容 */
  message: string
  /** 日志类型 */
  type: LogType
}

/** 可修改的状态属性名 */
export type StatKey = 'hp' | 'ps' | 'full' | 'moist' | 'san' | 'temp'

/** Store 状态接口 */
interface GameStoreState {
  // —— 状态属性 ——
  /** 当前游戏内经过的总小时数 */
  gameHour: number
  /** 当前地点 ID */
  currentPlace: string
  /** 游戏日志列表（最新的在最前） */
  logs: GameLog[]
  /** 玩家核心状态 */
  player: PlayerState
  /** 背包物品（物品ID → 数量） */
  inventory: Record<string, number>
  /** 背包最大容量 */
  maxInventory: number
  /** 装备槽位 */
  equipment: PlayerEquipment

  // —— 时间推进 ——
  /** 推进指定小时数并结算状态变化 */
  advanceTime: (hours: number) => void

  // —— 状态修改 ——
  /** 恢复指定状态值（不超过 max） */
  restoreState: (type: StatKey, amount: number) => void
  /** 消耗指定状态值（不低于 0） */
  consumeState: (type: StatKey, amount: number) => void
  /** 批量更新玩家状态 */
  updatePlayerState: (
    updates: Partial<Record<StatKey, Partial<{ current: number; max: number }>>>
  ) => void

  // —— 背包操作 ——
  /** 添加物品到背包 */
  addItem: (itemId: string, amount?: number) => void
  /** 从背包移除物品 */
  removeItem: (itemId: string, amount?: number) => void
  /** 检查背包是否拥有指定数量的物品 */
  hasItem: (itemId: string, amount?: number) => boolean

  // —— 装备操作 ——
  /** 装备物品到指定槽位 */
  equip: (itemId: string, slot: keyof PlayerEquipment) => void
  /** 卸下指定槽位的装备 */
  unequip: (slot: keyof PlayerEquipment) => void

  // —— 地点切换 ——
  /** 切换到指定地点 */
  travelTo: (placeId: string) => void

  // —— 日志管理 ——
  /** 添加日志（头部插入，上限 LOG_MAX_COUNT） */
  addLog: (message: string, type?: LogType) => void
  /** 清空所有日志 */
  clearLogs: () => void
}

// ========================
// 初始状态
// ========================

/** 玩家初始状态（使用常量文件中定义的数值） */
const initialPlayerState: PlayerState = {
  hp: { current: MAX_STATE, max: MAX_STATE },
  ps: { current: MAX_STATE, max: MAX_STATE },
  full: { current: INITIAL_FULL, max: MAX_STATE },
  moist: { current: INITIAL_MOIST, max: MAX_STATE },
  san: { current: MAX_STATE, max: MAX_STATE },
  temp: { current: TEMP_COMFORTABLE, max: TEMP_MAX },
}

// ========================
// 辅助函数
// ========================

/** 将数值钳制在 [min, max] 范围内 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** 获取体温的最小值（temp 比较特殊，范围是 -10 ~ 10） */
function getMinForStat(type: StatKey): number {
  return type === 'temp' ? TEMP_MIN : 0
}

// ========================
// Store 创建
// ========================

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      // —— 初始状态 ——
      gameHour: 0,
      currentPlace: INITIAL_PLACE,
      logs: [],
      player: { ...initialPlayerState },
      inventory: {},
      maxInventory: BAG_BASE_SIZE,
      equipment: {},

      // —— 时间推进与状态结算 ——
      advanceTime: (hours: number) => {
        // 参数校验：hours ≤ 0 直接返回
        if (hours <= 0) return

        set(state => {
          const player = { ...state.player }

          // 1. 饱食度消耗
          const newFullCurrent = clamp(
            player.full.current - hours * FULL_DESC_PER_HOUR,
            0,
            player.full.max
          )
          player.full = { ...player.full, current: newFullCurrent }

          // 2. 水分消耗
          const newMoistCurrent = clamp(
            player.moist.current - hours * MOIST_DESC_PER_HOUR,
            0,
            player.moist.max
          )
          player.moist = { ...player.moist, current: newMoistCurrent }

          // 3. 体力自然恢复（前提：饱食度 > 0，即结算前的饱食度）
          // 注意：使用结算后的饱食度判断饥饿惩罚
          if (newFullCurrent > 0) {
            const newPsCurrent = clamp(
              player.ps.current + hours * PS_RECOVER_PER_HOUR,
              0,
              player.ps.max
            )
            player.ps = { ...player.ps, current: newPsCurrent }
          }

          // 4. 生成时间推进日志
          const newLog: GameLog = {
            time: state.gameHour + hours,
            message: `时间过去了 ${hours} 小时...`,
            type: 'info',
          }

          const newLogs = [newLog, ...state.logs].slice(0, LOG_MAX_COUNT)

          return {
            gameHour: state.gameHour + hours,
            player,
            logs: newLogs,
          }
        })
      },

      // —— 状态修改 ——
      restoreState: (type: StatKey, amount: number) => {
        set(state => {
          const stat = state.player[type]
          const newCurrent = clamp(stat.current + amount, getMinForStat(type), stat.max)
          return {
            player: {
              ...state.player,
              [type]: { ...stat, current: newCurrent },
            },
          }
        })
      },

      consumeState: (type: StatKey, amount: number) => {
        set(state => {
          const stat = state.player[type]
          const newCurrent = clamp(stat.current - amount, getMinForStat(type), stat.max)
          return {
            player: {
              ...state.player,
              [type]: { ...stat, current: newCurrent },
            },
          }
        })
      },

      updatePlayerState: updates => {
        set(state => {
          const player = { ...state.player }
          for (const key of Object.keys(updates) as StatKey[]) {
            const update = updates[key]
            if (update) {
              const stat = { ...player[key] }
              if (update.max !== undefined) {
                stat.max = update.max
              }
              if (update.current !== undefined) {
                stat.current = clamp(update.current, getMinForStat(key), stat.max)
              }
              player[key] = stat
            }
          }
          return { player }
        })
      },

      // —— 背包操作 ——
      addItem: (itemId: string, amount = 1) => {
        set(state => {
          const inventory = { ...state.inventory }
          inventory[itemId] = (inventory[itemId] || 0) + amount
          return { inventory }
        })
      },

      removeItem: (itemId: string, amount = 1) => {
        set(state => {
          const inventory = { ...state.inventory }
          const current = inventory[itemId] || 0
          const remaining = current - amount
          if (remaining <= 0) {
            delete inventory[itemId]
          } else {
            inventory[itemId] = remaining
          }
          return { inventory }
        })
      },

      hasItem: (itemId: string, amount = 1) => {
        const state = get()
        return (state.inventory[itemId] || 0) >= amount
      },

      // —— 装备操作 ——
      equip: (itemId: string, slot: keyof PlayerEquipment) => {
        set(state => ({
          equipment: { ...state.equipment, [slot]: itemId },
        }))
      },

      unequip: (slot: keyof PlayerEquipment) => {
        set(state => {
          const equipment = { ...state.equipment }
          delete equipment[slot]
          return { equipment }
        })
      },

      // —— 地点切换 ——
      travelTo: (placeId: string) => {
        set({ currentPlace: placeId })
      },

      // —— 日志管理 ——
      addLog: (message: string, type: LogType = 'info') => {
        set(state => {
          const newLog: GameLog = {
            time: state.gameHour,
            message,
            type,
          }
          const newLogs = [newLog, ...state.logs].slice(0, LOG_MAX_COUNT)
          return { logs: newLogs }
        })
      },

      clearLogs: () => {
        set({ logs: [] })
      },
    }),
    {
      // persist 中间件配置
      name: 'kubition-game-storage',
      // 只持久化必要字段，排除 logs
      partialize: state => ({
        player: state.player,
        inventory: state.inventory,
        equipment: state.equipment,
        currentPlace: state.currentPlace,
        gameHour: state.gameHour,
      }),
    }
  )
)
