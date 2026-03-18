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
import { ProgressOverlay } from '@/components/ui/ProgressOverlay'
import { TownScene } from '@/components/scenes/TownScene'
import { ForestScene } from '@/components/scenes/ForestScene'
import { SmithScene } from '@/components/scenes/SmithScene'
import { AlchemyScene } from '@/components/scenes/AlchemyScene'
import { GenericScene } from '@/components/scenes/GenericScene'

/** 地点 ID → 场景组件的映射表 */
const SCENE_MAP: Record<string, ComponentType> = {
  town: TownScene,
  forest: ForestScene,
  smith: SmithScene,
  alchemy: AlchemyScene,
}

export function SceneRouter() {
  const currentPlace = useGameStore(state => state.currentPlace)
  const isTraveling = useGameStore(state => state.isTraveling)
  const travelProgress = useGameStore(state => state.travelProgress)
  const travelTarget = useGameStore(state => state.travelTarget)
  const isGathering = useGameStore(state => state.isGathering)
  const gatherProgress = useGameStore(state => state.gatherProgress)
  const isCrafting = useGameStore(state => state.isCrafting)
  const craftProgress = useGameStore(state => state.craftProgress)

  // 获取场景组件（有专属组件则用专属组件，否则用通用场景）
  const SceneComponent = SCENE_MAP[currentPlace] || GenericScene

  return (
    <div className="relative">
      {/* 场景内容 */}
      <SceneComponent />

      {/* 移动进度条覆盖层 */}
      <ProgressOverlay
        visible={isTraveling && !!travelTarget}
        progress={travelProgress}
        label={`正在前往 ${travelTarget ? getPlaceName(travelTarget) : ''}...`}
        barColor="bg-mud-info"
      />

      {/* 采集进度条覆盖层 */}
      <ProgressOverlay
        visible={isGathering}
        progress={gatherProgress}
        label="采集中..."
        barColor="bg-mud-success"
      />

      {/* 制造进度条覆盖层 */}
      <ProgressOverlay
        visible={isCrafting}
        progress={craftProgress}
        label="制造中..."
        barColor="bg-mud-warning"
      />
    </div>
  )
}
