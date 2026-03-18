/**
 * 游戏核心常量定义
 *
 * 所有游戏数值常量集中在此文件中，方便调试阶段快速调整。
 * Store、Hook 和组件中统一从此文件导入，禁止硬编码魔法数字。
 *
 * 取值来源：原始项目 KuBiTionAdvanture/src/data.js
 */

// ========================
// 状态上限
// ========================

/** 所有状态（hp/ps/full/moist/san）的基础上限，对应 data.js 中 MAX_STATE */
export const MAX_STATE = 100

// ========================
// 每小时消耗 / 恢复速率
// ========================

/** 每小时饱食度消耗，对应 data.js 中 FULL_DESC_PER_HOUR */
export const FULL_DESC_PER_HOUR = 1

/** 每小时水分消耗，对应 data.js 中 MOIST_DESC_PER_HOUR */
export const MOIST_DESC_PER_HOUR = 1

/** 夜间每小时理智消耗，对应 data.js 中 SAN_DESC_PER_HOUR */
export const SAN_DESC_PER_HOUR = 3

/** 每小时体力自然恢复（前提：未饥饿），对应 data.js 中 PS_RECOVER_PER_HOUR */
export const PS_RECOVER_PER_HOUR = 0.5

// ========================
// 背包 & 日志
// ========================

/** 背包基础容量，对应 data.js 中 BAG_BASE_SIZE */
export const BAG_BASE_SIZE = 12

/** 日志最大条数，对应 data.js 中 LOG_MAX_COUNT */
export const LOG_MAX_COUNT = 100

// ========================
// 初始地点
// ========================

/** 游戏开始时的初始地点ID，对应 data.js 中默认出生点 */
export const INITIAL_PLACE = 'town'

// ========================
// 初始状态值
// ========================

/** 初始饱食度（非满值，模拟"刚开始冒险时不是完全吃饱"） */
export const INITIAL_FULL = 80

/** 初始水分（非满值） */
export const INITIAL_MOIST = 80

// ========================
// 警告阈值
// ========================

/** 危急阈值：低于此值触发"极度饥饿/口渴/体力不足"警告（占 max 的百分比值） */
export const WARNING_CRITICAL_THRESHOLD = 20

/** 低值阈值：低于此值触发"感到饥饿/口渴"提示 */
export const WARNING_LOW_THRESHOLD = 50

/** 体力行动阈值：体力 ≤ 此值时无法执行消耗体力的动作 */
export const PS_CANT_ACT_THRESHOLD = 5

// ========================
// 体温范围
// ========================

/** 体温舒适值（current = 0 表示舒适） */
export const TEMP_COMFORTABLE = 0

/** 体温最大值 */
export const TEMP_MAX = 10

/** 体温最小值 */
export const TEMP_MIN = -10

// ========================
// 进度条参数
// ========================

/** 采集进度更新间隔（毫秒） */
export const GATHER_TICK_INTERVAL = 50
/** 每次 tick 增加的采集进度值 */
export const GATHER_TICK_INCREMENT = 2

/** 移动进度更新间隔（毫秒） */
export const TRAVEL_TICK_INTERVAL = 50
/** 每次 tick 增加的移动进度值 */
export const TRAVEL_TICK_INCREMENT = 2

// ========================
// 调试模式
// ========================

/** 是否为调试模式，调试模式下会显示额外的调试按钮和日志 */
export const DEBUG_MODE = true
