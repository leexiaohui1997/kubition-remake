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
import { SceneLayout } from '@/components/scenes/SceneLayout'

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
    <SceneLayout
      title={place.name}
      desc={place.desc}
      localActions={
        <>
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
        </>
      }
      travelActions={
        currentPlace !== 'town' ? (
          <button
            onClick={() => travel('town')}
            disabled={isActionDisabled}
            className="block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
              transition-colors duration-150 cursor-pointer text-mud-warning hover:bg-mud-bg-tertiary
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            [{++actionIndex}] 返回 {getPlaceName('town')}（约{PLACES.town?.timeNeed ?? 0.5}小时）
          </button>
        ) : undefined
      }
    />
  )
}
