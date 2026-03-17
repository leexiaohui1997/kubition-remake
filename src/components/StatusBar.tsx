/**
 * 状态栏组件
 *
 * 显示生命（红）、体力（黄）、饱食（橙）、水分（蓝）四项状态。
 * 显示游戏时间（"第 X 天 HH:00"格式）。
 * 响应式：PC 端水平一行 + 移动端 2×2 网格。
 */

import { useGameStore } from '@/stores/gameStore'
import { usePlayerStatus } from '@/hooks/usePlayerStatus'

/** 单项状态的配置 */
interface StatConfig {
  label: string
  key: 'hp' | 'ps' | 'full' | 'moist'
  color: string
  lowColor: string
}

/** 四项状态配置 */
const STAT_CONFIGS: StatConfig[] = [
  { label: '生命', key: 'hp', color: 'bg-red-500', lowColor: 'bg-red-700' },
  { label: '体力', key: 'ps', color: 'bg-yellow-500', lowColor: 'bg-yellow-700' },
  { label: '饱食', key: 'full', color: 'bg-orange-500', lowColor: 'bg-orange-700' },
  { label: '水分', key: 'moist', color: 'bg-blue-500', lowColor: 'bg-blue-700' },
]

/**
 * 将 gameHour 转换为"第 X 天 HH:00"格式
 */
function formatGameTime(gameHour: number): string {
  const day = Math.floor(gameHour / 24) + 1
  const hour = gameHour % 24
  const hourStr = String(hour).padStart(2, '0')
  return `第 ${day} 天 ${hourStr}:00`
}

export function StatusBar() {
  const player = useGameStore(state => state.player)
  const gameHour = useGameStore(state => state.gameHour)
  const { warnings } = usePlayerStatus()

  return (
    <div className="bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-3">
      {/* 游戏时间 - 移动端显示在顶部 */}
      <div className="flex items-center justify-between mb-2 md:hidden">
        <span className="text-mud-text-dim text-xs">⏰ {formatGameTime(gameHour)}</span>
      </div>

      {/* 状态项 + 时间（PC端） */}
      <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-4">
        {STAT_CONFIGS.map(config => {
          const stat = player[config.key]
          const percent = stat.max > 0 ? (stat.current / stat.max) * 100 : 0
          const isLow = percent < 20

          return (
            <div key={config.key} className="flex-1 min-w-0">
              {/* 标签 + 数值 */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold ${
                    isLow ? 'text-mud-warning animate-pulse' : 'text-mud-text'
                  }`}
                >
                  {config.label}
                </span>
                <span className="text-xs text-mud-text-dim">
                  {Math.floor(stat.current)}/{stat.max}
                </span>
              </div>
              {/* 进度条 */}
              <div className="w-full h-2 bg-mud-bg rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isLow ? config.lowColor + ' animate-pulse' : config.color
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
                />
              </div>
            </div>
          )
        })}

        {/* 游戏时间 - PC 端显示在右侧 */}
        <div className="hidden md:flex md:items-center md:ml-auto md:pl-4 md:border-l md:border-mud-bg-tertiary">
          <span className="text-mud-text-dim text-xs whitespace-nowrap">
            ⏰ {formatGameTime(gameHour)}
          </span>
        </div>
      </div>

      {/* 警告提示 */}
      {warnings.length > 0 && (
        <div className="mt-2 pt-2 border-t border-mud-bg-tertiary">
          {warnings.map((warning, index) => (
            <p key={index} className="text-xs text-mud-warning animate-pulse">
              ⚠ {warning}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
