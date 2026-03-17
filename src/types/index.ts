/**
 * 游戏核心状态接口
 */
export interface GameState {
  /** 游戏版本号 */
  version: string
  /** 游戏开始时间戳（毫秒） */
  startTime: number
}
