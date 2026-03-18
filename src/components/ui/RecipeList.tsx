/**
 * 配方列表组件
 *
 * 展示指定分类的配方列表，按三态分组排序：
 * 1. 可制作（蓝色可点击）
 * 2. 材料不足（暗灰色禁用，列出缺少材料）
 * 3. 未解锁（带🔒图标，提示所需科技名称）
 */

import { useMemo } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useCrafting } from '@/hooks/useCrafting'
import { RecipeItem } from '@/components/ui/RecipeItem'
import type { RecipeStatus } from '@/components/ui/RecipeItem'
import type { Recipe, RecipeCategory } from '@/types/game'

interface RecipeListProps {
  /** 配方列表 */
  recipes: Recipe[]
  /** 配方分类（用于标题显示） */
  type: Extract<RecipeCategory, 'smith' | 'alchemy'>
}

interface RecipeWithStatus {
  recipe: Recipe
  status: RecipeStatus
  /** 缺少的材料（仅 missing 状态） */
  missingDesc?: { itemId: string; lack: number }[]
  /** 所需科技 id（仅 locked 状态） */
  scienceName?: string
}

export function RecipeList({ recipes, type: _type }: RecipeListProps) {
  const inventory = useGameStore(state => state.inventory)
  const unlockedSciences = useGameStore(state => state.unlockedSciences)
  const isCrafting = useGameStore(state => state.isCrafting)
  const isTraveling = useGameStore(state => state.isTraveling)
  const isGathering = useGameStore(state => state.isGathering)
  const { startCraft } = useCrafting()

  const isActionDisabled = isCrafting || isTraveling || isGathering

  /** 计算每个配方的状态 */
  const recipesWithStatus = useMemo<RecipeWithStatus[]>(() => {
    return recipes.map(recipe => {
      // 1. 科技锁定检查
      if (recipe.requiredScience && !unlockedSciences.includes(recipe.requiredScience)) {
        return {
          recipe,
          status: 'locked' as RecipeStatus,
          scienceName: recipe.requiredScience,
        }
      }

      // 2. 材料检查
      const missingDesc: { itemId: string; lack: number }[] = []
      for (const [itemId, amount] of Object.entries(recipe.materials)) {
        const owned = inventory[itemId] ?? 0
        if (owned < amount) {
          missingDesc.push({ itemId, lack: amount - owned })
        }
      }

      if (missingDesc.length > 0) {
        return {
          recipe,
          status: 'missing' as RecipeStatus,
          missingDesc,
        }
      }

      return { recipe, status: 'craftable' as RecipeStatus }
    })
  }, [recipes, inventory, unlockedSciences])

  /** 按三态分组排序：可制作 → 材料不足 → 未解锁 */
  const sortedRecipes = useMemo(() => {
    const order: Record<RecipeStatus, number> = { craftable: 0, missing: 1, locked: 2 }
    return [...recipesWithStatus].sort((a, b) => order[a.status] - order[b.status])
  }, [recipesWithStatus])

  if (sortedRecipes.length === 0) {
    return (
      <p className="text-xs text-mud-text-dim py-2">暂无可用配方</p>
    )
  }

  return (
    <div className="space-y-1">
      {sortedRecipes.map(({ recipe, status, missingDesc, scienceName }) => (
        <RecipeItem
          key={recipe.id}
          recipe={recipe}
          status={status}
          missingDesc={missingDesc}
          scienceName={scienceName}
          isActionDisabled={isActionDisabled}
          onCraft={startCraft}
        />
      ))}
    </div>
  )
}
