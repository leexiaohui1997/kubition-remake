/**
 * 游戏 UI 样式映射
 *
 * 将游戏内枚举值（英文 key）映射为对应的 CSS 样式类名。
 * 所有组件统一从此文件导入，避免各处重复定义。
 */

import type { StatConfig } from '@/types/player'

/** 物品类型对应的颜色 */
export const ITEM_TYPE_COLOR: Record<string, string> = {
  food: 'text-green-400',
  cooked: 'text-green-300',
  weapon: 'text-red-400',
  equip: 'text-blue-400',
  met: 'text-mud-text-dim',
  poizon: 'text-purple-400',
  tool: 'text-yellow-400',
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
