/**
 * 森林场景组件
 *
 * 静谧森林场景页面，基于 PLACES.forest 数据驱动。
 * 包含场景描述、采集操作按钮和返回城镇的移动按钮。
 * MUD 风格按钮：[序号] 操作名称。
 */

import { useGameStore } from '@/stores/gameStore'
import { useTravel } from '@/hooks/useTravel'
import { useGathering } from '@/hooks/useGathering'
import { getPlace, getPlaceName } from '@/data/places'
import { SceneLayout } from '@/components/scenes/SceneLayout'

export function ForestScene() {
  const isTraveling = useGameStore(state => state.isTraveling)
  const isGathering = useGameStore(state => state.isGathering)
  const { travel } = useTravel()
  const { gather } = useGathering()

  const place = getPlace('forest')
  const isActionDisabled = isTraveling || isGathering

  let actionIndex = 0

  return (
    <SceneLayout
      title={place?.name ?? '静谧森林'}
      desc={
        place?.desc ??
        '阳光穿过茂密的树冠，在林间地面上投下斑驳的光影。空气中弥漫着松脂和野花的芬芳。偶尔可以听到鸟鸣和溪水声。这片森林看起来资源丰富，但也潜伏着危险。'
      }
      localActions={
        <>
          {/* 资源采集按钮（基于 PLACES.forest.resources 数据） */}
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
        </>
      }
      travelActions={
        <button
          onClick={() => travel('town')}
          disabled={isActionDisabled}
          className="block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
            transition-colors duration-150 cursor-pointer text-mud-warning hover:bg-mud-bg-tertiary
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [{++actionIndex}] 返回 {getPlaceName('town')}（约{getPlace('town')?.timeNeed ?? 0.5}小时）
        </button>
      }
    />
  )
}
