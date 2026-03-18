/**
 * 铁匠铺场景组件
 *
 * 展示 smith 类配方列表，玩家可在此制作武器、工具和装备。
 * MUD 风格，深色背景、等宽字体。
 */

import { useGameStore } from '@/stores/gameStore'
import { RecipeList } from '@/components/ui/RecipeList'
import { SMITH_RECIPES } from '@/data/recipes'
import { SceneLayout } from '@/components/scenes/SceneLayout'

export function SmithScene() {
  const travelTo = useGameStore(state => state.travelTo)
  const isCrafting = useGameStore(state => state.isCrafting)
  const isTraveling = useGameStore(state => state.isTraveling)
  const isGathering = useGameStore(state => state.isGathering)

  const isActionDisabled = isCrafting || isTraveling || isGathering

  const smithRecipes = Object.values(SMITH_RECIPES)

  return (
    <SceneLayout
      title="⚒ 铁匠铺"
      desc="炉火熊熊，铁锤声不绝于耳。老铁匠抬起头，用布擦了擦手上的油污，朝你点了点头。这里可以将原材料锻造成武器、工具和装备。"
      localLabel='可制作的物品'
      localActions={
        <RecipeList recipes={smithRecipes} type="smith" />
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
