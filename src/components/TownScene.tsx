/**
 * 城镇场景组件
 *
 * 初始的城镇场景页面，包含场景描述和可交互的操作按钮。
 * MUD 风格按钮：[序号] 操作名称。
 * 响应式：移动端按钮最小触摸区域 44px。
 */

import { useGameStore } from '@/stores/gameStore'
import { usePlayerStatus } from '@/hooks/usePlayerStatus'

/** 操作按钮定义 */
interface ActionButton {
  /** 按钮序号 */
  index: number
  /** 操作名称 */
  label: string
  /** 点击回调 */
  action: () => void
  /** 是否为测试按钮 */
  isTest?: boolean
}

export function TownScene() {
  const advanceTime = useGameStore(state => state.advanceTime)
  const addLog = useGameStore(state => state.addLog)
  const restoreState = useGameStore(state => state.restoreState)
  const consumeState = useGameStore(state => state.consumeState)
  const { canAct } = usePlayerStatus()

  /** 操作按钮列表 */
  const actions: ActionButton[] = [
    {
      index: 1,
      label: '休息一会儿',
      action: () => {
        addLog('你休息了一会儿，恢复了些体力', 'success')
        advanceTime(2)
      },
    },
    {
      index: 2,
      label: '在镇上闲逛',
      action: () => {
        addLog('你在银溪镇四处逛了逛...', 'info')
        advanceTime(1)
      },
    },
    {
      index: 3,
      label: '测试: 恢复体力',
      isTest: true,
      action: () => {
        restoreState('ps', 20)
        addLog('（测试）恢复了 20 点体力', 'success')
      },
    },
    {
      index: 4,
      label: '测试: 消耗饱食',
      isTest: true,
      action: () => {
        consumeState('full', 10)
        addLog('（测试）消耗了 10 点饱食度', 'warning')
      },
    },
  ]

  return (
    <div className="bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-4">
      {/* 场景标题 */}
      <h2 className="text-lg font-bold text-mud-accent mb-2">银溪镇</h2>

      {/* 场景描述 */}
      <p className="text-sm text-mud-text-dim mb-4 leading-relaxed break-words">
        你站在银溪镇的中央广场上。微风吹过破旧的招牌，远处传来铁匠铺的锤击声。
        这座小镇虽然不大，却是冒险者们重要的补给站。四周的建筑显得有些老旧， 但街道上行人络绎不绝。
      </p>

      {/* 分隔线 */}
      <div className="border-t border-mud-bg-tertiary my-3" />

      {/* 操作列表 */}
      <div className="space-y-1">
        <p className="text-xs text-mud-text-dim mb-2">可执行的操作：</p>
        {actions.map(action => (
          <button
            key={action.index}
            onClick={action.action}
            disabled={!canAct && !action.isTest}
            className={`
              block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
              transition-colors duration-150 cursor-pointer
              ${
                action.isTest
                  ? 'text-mud-text-dim hover:bg-mud-bg-tertiary'
                  : 'text-mud-info hover:bg-mud-bg-tertiary'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            [{action.index}] {action.label}
          </button>
        ))}
      </div>

      {/* 无法行动提示 */}
      {!canAct && (
        <p className="mt-3 text-xs text-mud-warning animate-pulse">
          ⚠ 体力不足，无法执行消耗体力的动作！
        </p>
      )}
    </div>
  )
}
