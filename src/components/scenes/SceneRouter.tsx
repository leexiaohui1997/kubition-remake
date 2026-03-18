/**
 * 场景路由组件
 *
 * 根据 gameStore.currentPlace 动态加载对应的场景组件。
 * 支持移动进度条和采集进度条的覆盖显示。
 * 未注册的地点自动渲染 GenericScene。
 */

import { type ComponentType } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { getPlaceName } from '@/data/places'
import { TownScene } from '@/components/scenes/TownScene'
import { ForestScene } from '@/components/scenes/ForestScene'
import { GenericScene } from '@/components/scenes/GenericScene'

/** 地点 ID → 场景组件的映射表 */
const SCENE_MAP: Record<string, ComponentType> = {
  town: TownScene,
  forest: ForestScene,
}

export function SceneRouter() {
  const currentPlace = useGameStore(state => state.currentPlace)
  const isTraveling = useGameStore(state => state.isTraveling)
  const travelProgress = useGameStore(state => state.travelProgress)
  const travelTarget = useGameStore(state => state.travelTarget)
  const isGathering = useGameStore(state => state.isGathering)
  const gatherProgress = useGameStore(state => state.gatherProgress)

  // 获取场景组件（有专属组件则用专属组件，否则用通用场景）
  const SceneComponent = SCENE_MAP[currentPlace] || GenericScene

  return (
    <div className="relative">
      {/* 场景内容 */}
      <SceneComponent />

      {/* 移动进度条覆盖层 */}
      {isTraveling && travelTarget && (
        <div className="absolute inset-0 bg-mud-bg/90 flex flex-col items-center justify-center rounded z-10">
          <p className="text-mud-info text-sm mb-3 animate-pulse">
            正在前往 {getPlaceName(travelTarget)}...
          </p>
          {/* 进度条容器 */}
          <div className="w-3/4 max-w-xs h-3 bg-mud-bg-tertiary rounded overflow-hidden border border-mud-bg-tertiary">
            <div
              className="h-full bg-mud-info transition-all duration-100 ease-linear rounded"
              style={{ width: `${travelProgress}%` }}
            />
          </div>
          <p className="text-mud-text-dim text-xs mt-2">{Math.round(travelProgress)}%</p>
        </div>
      )}

      {/* 采集进度条覆盖层 */}
      {isGathering && (
        <div className="absolute inset-0 bg-mud-bg/90 flex flex-col items-center justify-center rounded z-10">
          <p className="text-mud-success text-sm mb-3 animate-pulse">采集中...</p>
          {/* 进度条容器 */}
          <div className="w-3/4 max-w-xs h-3 bg-mud-bg-tertiary rounded overflow-hidden border border-mud-bg-tertiary">
            <div
              className="h-full bg-mud-success transition-all duration-100 ease-linear rounded"
              style={{ width: `${gatherProgress}%` }}
            />
          </div>
          <p className="text-mud-text-dim text-xs mt-2">{Math.round(gatherProgress)}%</p>
        </div>
      )}
    </div>
  )
}
