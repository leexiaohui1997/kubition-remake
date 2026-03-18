/**
 * 城镇场景组件
 *
 * 银溪镇场景页面，基于 PLACES.town 数据驱动。
 * 包含场景描述、休息操作、资源采集按钮和前往其他地点的移动按钮。
 * MUD 风格按钮：[序号] 操作名称。
 * 响应式：移动端按钮最小触摸区域 44px。
 */

import { useGameStore } from '@/stores/gameStore'
import { useTravel } from '@/hooks/useTravel'
import { useGathering } from '@/hooks/useGathering'
import { getPlace, getPlaceName } from '@/data/places'

export function TownScene() {
  const advanceTime = useGameStore(state => state.advanceTime)
  const addLog = useGameStore(state => state.addLog)
  const restoreState = useGameStore(state => state.restoreState)
  const isTraveling = useGameStore(state => state.isTraveling)
  const isGathering = useGameStore(state => state.isGathering)
  const { travel } = useTravel()
  const { gather } = useGathering()

  const place = getPlace('town')
  const isActionDisabled = isTraveling || isGathering

  // 森林数据用于移动按钮显示
  const forest = getPlace('forest')

  let actionIndex = 0

  return (
    <div className="bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-4">
      {/* 场景标题 */}
      <h2 className="text-lg font-bold text-mud-accent mb-2">{place?.name ?? '银溪镇'}</h2>

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

        {/* 休息操作（城镇特有） */}
        <button
          onClick={() => {
            restoreState('ps', 20)
            addLog('你休息了一会儿，恢复了些体力', 'success')
            advanceTime(2)
          }}
          disabled={isActionDisabled}
          className="block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
            transition-colors duration-150 cursor-pointer text-mud-info hover:bg-mud-bg-tertiary
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [{++actionIndex}] 休息一会儿
        </button>

        {/* 资源采集按钮（基于 PLACES.town.resources 数据） */}
        {place?.resources?.map(resource => {
          actionIndex++
          return (
            <button
              key={resource.id}
              onClick={() => gather(resource)}
              disabled={isActionDisabled}
              className="block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
                transition-colors duration-150 cursor-pointer text-mud-info hover:bg-mud-bg-tertiary
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              [{actionIndex}] {resource.actionName}
              {resource.name}
            </button>
          )
        })}

        {/* 分隔线 */}
        <div className="border-t border-mud-bg-tertiary my-2" />

        {/* 前往森林 */}
        {forest && (
          <button
            onClick={() => travel('forest')}
            disabled={isActionDisabled}
            className="block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
              transition-colors duration-150 cursor-pointer text-mud-warning hover:bg-mud-bg-tertiary
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            [{++actionIndex}] 前往 {getPlaceName('forest')}（约{forest.timeNeed}小时）
          </button>
        )}
      </div>
    </div>
  )
}
