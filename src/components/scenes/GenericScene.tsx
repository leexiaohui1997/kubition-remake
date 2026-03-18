/**
 * 通用场景组件
 *
 * 当某个地点没有专属场景组件时，基于地点数据自动生成 UI。
 * 包含场景名称、描述、资源采集按钮、移动按钮等。
 */

import { useGameStore } from '@/stores/gameStore'
import { getPlace, getPlaceName, PLACES } from '@/data/places'
import { useTravel } from '@/hooks/useTravel'
import { useGathering } from '@/hooks/useGathering'

export function GenericScene() {
  const currentPlace = useGameStore(state => state.currentPlace)
  const isTraveling = useGameStore(state => state.isTraveling)
  const isGathering = useGameStore(state => state.isGathering)
  const { travel } = useTravel()
  const { gather } = useGathering()

  const place = getPlace(currentPlace)
  if (!place) {
    return (
      <div className="bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-4">
        <p className="text-mud-danger">未知地点: {currentPlace}</p>
      </div>
    )
  }

  const isActionDisabled = isTraveling || isGathering
  let actionIndex = 0

  return (
    <div className="bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-4">
      {/* 场景标题 */}
      <h2 className="text-lg font-bold text-mud-accent mb-2">{place.name}</h2>

      {/* 场景描述 */}
      {place.desc && (
        <p className="text-sm text-mud-text-dim mb-4 leading-relaxed break-words">{place.desc}</p>
      )}

      {/* 分隔线 */}
      <div className="border-t border-mud-bg-tertiary my-3" />

      {/* 操作列表 */}
      <div className="space-y-1">
        <p className="text-xs text-mud-text-dim mb-2">可执行的操作：</p>

        {/* 资源采集按钮 */}
        {place.resources?.map(resource => {
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

        {/* 移动按钮 — 返回银溪镇（如果不在城镇） */}
        {currentPlace !== 'town' && (
          <button
            onClick={() => travel('town')}
            disabled={isActionDisabled}
            className="block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
              transition-colors duration-150 cursor-pointer text-mud-warning hover:bg-mud-bg-tertiary
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            [{++actionIndex}] 返回 {getPlaceName('town')}（约{PLACES.town?.timeNeed ?? 0.5}小时）
          </button>
        )}
      </div>
    </div>
  )
}
