/**
 * 单个配方条目组件
 *
 * 展示一条配方的名称、材料需求、缺少材料提示和科技锁定提示。
 * 调试模式下额外显示【获得材料】按钮，点击后直接将所需材料加入背包。
 */

import { useGameStore } from '@/stores/gameStore'
import { ItemName } from '@/components/ItemName'
import { DEBUG_MODE } from '@/constants/game'
import type { Recipe } from '@/types/game'

/** 配方状态 */
export type RecipeStatus = 'craftable' | 'missing' | 'locked'

export interface RecipeItemProps {
  recipe: Recipe
  status: RecipeStatus
  /** 缺少的材料（仅 missing 状态） */
  missingDesc?: { itemId: string; lack: number }[]
  /** 所需科技 id（仅 locked 状态） */
  scienceName?: string
  /** 是否禁用操作（正在制造/移动/采集时） */
  isActionDisabled: boolean
  /** 点击制作回调 */
  onCraft: (recipe: Recipe) => void
}

export function RecipeItem({
  recipe,
  status,
  missingDesc,
  scienceName,
  isActionDisabled,
  onCraft,
}: RecipeItemProps) {
  const addItem = useGameStore(state => state.addItem)
  const addLog = useGameStore(state => state.addLog)

  const isCraftable = status === 'craftable'
  const isMissing = status === 'missing'
  const isLocked = status === 'locked'

  // 材料需求描述
  const materialsDesc = Object.entries(recipe.materials)

  /** 调试：获得当前配方所需的全部材料 */
  function handleDebugGetMaterials() {
    const parts: string[] = []
    for (const [itemId, amount] of Object.entries(recipe.materials)) {
      addItem(itemId, amount)
      parts.push(`${itemId} x${amount}`)
    }
    addLog(`获得材料：${parts.join('、')}`, 'warning')
  }

  return (
    <div className="rounded px-3 py-2 bg-mud-bg-secondary border border-mud-bg-tertiary">
      {/* 配方主行 */}
      <div className={`flex items-center gap-2 ${isMissing ? 'opacity-60' : ''} ${isLocked ? 'opacity-40' : ''}`}>
        {/* 配方名称与耗时 */}
        <div className="flex-1 text-left font-mono text-sm">
          {isLocked && <span className="mr-1">🔒</span>}
          <ItemName item={{ id: recipe.id }} truncate={false} />
          <span className="text-mud-text-dim text-xs ml-2">
            （{recipe.timeCost}h）
          </span>
        </div>

        {/* 调试按钮：获得材料 */}
        {DEBUG_MODE && (
          <button
            onClick={handleDebugGetMaterials}
            className="shrink-0 text-xs px-1.5 py-0.5 rounded border border-amber-600 text-amber-500 hover:bg-amber-600/20 transition-colors duration-150"
            title="[调试] 获得此配方所需的全部材料"
          >
            获得材料
          </button>
        )}

        {/* 制作按钮 */}
        <button
          onClick={() => onCraft(recipe)}
          disabled={!isCraftable || isActionDisabled}
          className={`shrink-0 text-xs px-2 py-0.5 rounded border transition-colors duration-150
            ${isCraftable && !isActionDisabled
              ? 'border-mud-primary text-mud-primary hover:bg-mud-primary/20 cursor-pointer'
              : 'border-mud-bg-tertiary text-mud-text-dim cursor-not-allowed'
            }
          `}
        >
          制作
        </button>
      </div>

      {/* 材料需求 */}
      <p className="text-xs text-mud-text-dim mt-0.5 pl-1 flex flex-wrap gap-x-1">
        <span>材料：</span>
        {materialsDesc.map(([itemId, amount], i) => (
          <span key={itemId} className="inline-flex items-center gap-0.5">
            {i > 0 && <span className="text-mud-text-dim">/</span>}
            <ItemName item={{ id: itemId }} truncate={false} />
            <span className="text-mud-text-dim">x{amount}</span>
          </span>
        ))}
      </p>

      {/* 缺少材料提示 */}
      {isMissing && missingDesc && (
        <p className="text-xs text-mud-danger mt-0.5 pl-1 flex flex-wrap gap-x-1">
          <span>缺少：</span>
          {missingDesc.map(({ itemId, lack }, i) => (
            <span key={itemId} className="inline-flex items-center gap-0.5">
              {i > 0 && <span>、</span>}
              <ItemName item={{ id: itemId }} truncate={false} />
              <span>x{lack}</span>
            </span>
          ))}
        </p>
      )}

      {/* 科技锁定提示 */}
      {isLocked && scienceName && (
        <p className="text-xs text-mud-warning mt-0.5 pl-1 inline-flex items-center gap-1">
          <span>需要科技：</span>
          <ItemName item={{ id: scienceName }} truncate={false} />
        </p>
      )}
    </div>
  )
}
