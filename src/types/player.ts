/**
 * 玩家状态与装备类型定义
 */

// ========================
// 状态值
// ========================

/** 状态值（当前值 + 最大值） */
export interface StateValue {
  /** 当前值 */
  current: number
  /** 最大值 */
  max: number
}

// ========================
// 玩家状态
// ========================

/** 玩家核心状态 */
export interface PlayerState {
  /** 生命值 */
  hp: StateValue
  /** 体力 */
  ps: StateValue
  /** 饱食度 */
  full: StateValue
  /** 水分 */
  moist: StateValue
  /** 理智 */
  san: StateValue
  /** 体温（current 范围 -10 ~ 10） */
  temp: StateValue
}

// ========================
// 玩家装备
// ========================

/** 玩家装备槽位（值为物品ID或undefined表示未装备） */
export interface PlayerEquipment {
  /** 主手武器 */
  mainHand?: string
  /** 副手 */
  subHand?: string
  /** 头部 */
  head?: string
  /** 躯干 */
  body?: string
  /** 手部 */
  hand?: string
  /** 腿部/足部 */
  leg?: string
  /** 颈部 */
  neck?: string
}
