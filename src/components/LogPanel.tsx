/**
 * 日志面板组件
 *
 * 显示冒险日志，支持入场动画、按类型着色、清除功能。
 * 使用 BetterScroll 提供流畅滚动体验，新日志自动滚顶。
 * 响应式：PC 端 h-48 右侧 1/3 + 移动端撑满 h-40。
 */

import { useGameStore } from '@/stores/gameStore'
import type { LogType } from '@/stores/gameStore'
import { useBetterScroll } from '@/hooks/useBetterScroll'
import { LOG_COLOR } from '@/constants/styles'

/**
 * 将 gameHour 转换为"[第X天 HH:00]"格式的时间戳
 */
function formatLogTime(gameHour: number): string {
  const day = Math.floor(gameHour / 24) + 1
  const hour = Math.floor(gameHour % 24)
  const hourStr = String(hour).padStart(2, '0')
  return `[第${day}天 ${hourStr}:00]`
}

export function LogPanel() {
  const logs = useGameStore(state => state.logs)
  const clearLogs = useGameStore(state => state.clearLogs)

  // 使用 BetterScroll 管理日志列表的滚动（新日志在顶部，自动滚顶）
  const { wrapperRef } = useBetterScroll<HTMLDivElement>({
    scrollY: true,
    autoScrollTop: true,
    deps: [logs.length],
  })

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

      {/* 日志列表 — BetterScroll wrapper */}
      <div
        ref={wrapperRef}
        className="h-40 md:h-48 overflow-hidden bg-mud-bg rounded p-2 font-mono text-xs relative"
      >
        {/* BetterScroll content — 必须是 wrapper 的唯一子元素 */}
        <div>
          {logs.length === 0 ? (
            <p className="text-mud-text-dim italic">暂无日志...</p>
          ) : (
            logs.map((log, index) => (
              <div
                key={`${log.time}-${log.message}-${index}`}
                className={`py-0.5 leading-relaxed animate-log-in ${LOG_COLOR[log.type]}`}
              >
                <span className="text-mud-text-dim">{formatLogTime(log.time)}</span> {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
