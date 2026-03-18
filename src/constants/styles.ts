/**
 * 游戏 UI 样式映射
 *
 * 将游戏内枚举值（英文 key）映射为对应的 CSS 样式类名。
 * 所有组件统一从此文件导入，避免各处重复定义。
 */

import type { StatConfig } from '@/types/player'
import { ItemType } from '@/types/game'

/** 物品类型对应的颜色 */
export const ITEM_TYPE_COLOR: Record<ItemType, string> = {
  // ── 普通物品 ──
  [ItemType.Food]:    'text-amber-400',   // 食材 —— 琥珀色
  [ItemType.Cooked]:  'text-amber-300',   // 熟食 —— 浅琥珀色
  [ItemType.Weapon]:  'text-red-400',     // 武器 —— 红色
  [ItemType.Equip]:   'text-blue-300',    // 装备 —— 蓝色
  [ItemType.Met]:     'text-mud-text-dim',// 材料 —— 暗色
  [ItemType.Bullet]:  'text-mud-text-dim',// 弹药 —— 暗色
  [ItemType.Poizon]:  'text-rose-400',    // 毒药 —— 玫红色
  [ItemType.Tool]:    'text-green-400',   // 道具 —— 绿色
  [ItemType.Quest]:   'text-purple-400',  // 任务 —— 紫色
  [ItemType.Seed]:    'text-lime-400',    // 种子 —— 黄绿色
  [ItemType.Art]:     'text-yellow-400',  // 艺术品 —— 金黄色
  [ItemType.Special]: 'text-purple-300',  // 特殊 —— 浅紫色
  // ── 科技树节点（统一青色系）──
  [ItemType.UnknownBonus]:       'text-cyan-400',
  [ItemType.BigBoxSizeBonus]:    'text-cyan-400',
  [ItemType.BagSizeBonus]:       'text-cyan-400',
  [ItemType.FarmSizeBonus]:      'text-cyan-400',
  [ItemType.AlcoSizeBonus]:      'text-cyan-400',
  [ItemType.TrapSizeBonus]:      'text-cyan-400',
  [ItemType.WellBonus]:          'text-cyan-400',
  [ItemType.MakeSpeed]:          'text-cyan-400',
  [ItemType.CookerUpdate]:       'text-cyan-400',
  [ItemType.DurableUpdate]:      'text-cyan-400',
  [ItemType.MagicDurableUpdate]: 'text-cyan-400',
  [ItemType.CollectDec]:         'text-cyan-400',
  [ItemType.TrapChance]:         'text-cyan-400',
  [ItemType.TrapGet]:            'text-cyan-400',
  [ItemType.LockUpdate]:         'text-cyan-400',
  [ItemType.SecurityBox]:        'text-cyan-400',
  [ItemType.MapBonus]:           'text-cyan-400',
  [ItemType.BeaconMax]:          'text-cyan-400',
  [ItemType.SleepPlace]:         'text-cyan-400',
  [ItemType.ShowerPlace]:        'text-cyan-400',
}

/** 日志类型 → 文字颜色映射 */
export const LOG_COLOR: Record<string, string> = {
  success: 'text-mud-success',
  warning: 'text-mud-warning',
  error: 'text-mud-danger',
  info: 'text-mud-text-dim',
}

/** 四项状态配置（生命/体力/饱食/水分） */
export const STAT_CONFIGS: StatConfig[] = [
  { label: '生命', key: 'hp', color: 'bg-red-500', lowColor: 'bg-red-700' },
  { label: '体力', key: 'ps', color: 'bg-yellow-500', lowColor: 'bg-yellow-700' },
  { label: '饱食', key: 'full', color: 'bg-orange-500', lowColor: 'bg-orange-700' },
  { label: '水分', key: 'moist', color: 'bg-blue-500', lowColor: 'bg-blue-700' },
]
