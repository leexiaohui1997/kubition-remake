/**
 * 日志面板组件
 *
 * 显示冒险日志，支持入场动画、按类型着色、清除功能。
 * 响应式：PC 端 h-48 右侧 1/3 + 移动端撑满 h-40。
 */

import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/stores/gameStore'
import type { LogType } from '@/stores/gameStore'

/** 日志类型 → 文字颜色映射 */
const LOG_COLOR_MAP: Record<LogType, string> = {
  success: 'text-mud-success',
  warning: 'text-mud-warning',
  error: 'text-mud-danger',
  info: 'text-mud-text-dim',
}

/**
 * 将 gameHour 转换为"[第X天 HH:00]"格式的时间戳
 */
function formatLogTime(gameHour: number): string {
  const day = Math.floor(gameHour / 24) + 1
  const hour = gameHour % 24
  const hourStr = String(hour).padStart(2, '0')
  return `[第${day}天 ${hourStr}:00]`
}

export function LogPanel() {
  const logs = useGameStore(state => state.logs)
  const clearLogs = useGameStore(state => state.clearLogs)

  return (
    <div className="bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-3 flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-mud-accent">冒险日志</h3>
        <button
          onClick={clearLogs}
          className="text-xs text-mud-text-dim hover:text-mud-warning transition-colors cursor-pointer"
        >
          [清除]
        </button>
      </div>

      {/* 日志列表 */}
      <div className="h-40 md:h-48 overflow-y-auto bg-mud-bg rounded p-2 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-mud-text-dim italic">暂无日志...</p>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log, index) => (
              <motion.div
                key={`${log.time}-${log.message}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`py-0.5 leading-relaxed ${LOG_COLOR_MAP[log.type]}`}
              >
                <span className="text-mud-text-dim">{formatLogTime(log.time)}</span> {log.message}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
