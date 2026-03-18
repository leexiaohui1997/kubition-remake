/**
 * 炼金台场景组件
 *
 * 展示 alchemy 类配方列表，玩家可在此制作药水和食物。
 * MUD 风格，深色背景、等宽字体。
 */

import { useGameStore } from '@/stores/gameStore'
import { RecipeList } from '@/components/ui/RecipeList'
import { ALCHEMY_RECIPES } from '@/data/recipes'
import { SceneLayout } from '@/components/scenes/SceneLayout'

export function AlchemyScene() {
  const travelTo = useGameStore(state => state.travelTo)
  const isCrafting = useGameStore(state => state.isCrafting)
  const isTraveling = useGameStore(state => state.isTraveling)
  const isGathering = useGameStore(state => state.isGathering)

  const isActionDisabled = isCrafting || isTraveling || isGathering

  const alchemyRecipes = Object.values(ALCHEMY_RECIPES)

  return (
    <SceneLayout
      title="⚗ 炼金台"
      desc="玻璃瓶和陶罐整齐地排列在架子上，空气中弥漫着草药和矿物的气息。这里可以将采集到的材料炼制成药水和食物，为冒险提供补给。"
      localLabel='可制作的物品'
      localActions={
        <RecipeList recipes={alchemyRecipes} type="alchemy" />
      }
      travelActions={
        <button
          onClick={() => travelTo('town')}
          disabled={isActionDisabled}
          className="block w-full text-left font-mono text-sm min-h-[44px] px-3 py-2 rounded
            transition-colors duration-150 cursor-pointer text-mud-warning hover:bg-mud-bg-tertiary
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [1] 返回银溪镇
        </button>
      }
    />
  )
}
