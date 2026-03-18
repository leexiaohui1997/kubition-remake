/**
 * 背包内容组件
 *
 * 纯内容组件，显示玩家背包中的物品列表，支持使用可用物品。
 * 使用 BetterScroll 提供滚动功能。
 * 弹层能力由通用 Modal 组件提供。
 * MUD 风格主题。
 */

import { useGameStore } from '@/stores/gameStore'
import { useBetterScroll } from '@/hooks/useBetterScroll'
import { getItem } from '@/data/items'
import { useItem } from '@/systems/GatheringSystem'
import { ItemName } from '@/components/ItemName'
import { ITEM_TYPE_LABEL } from '@/constants/labels'
import { ITEM_TYPE_COLOR } from '@/constants/styles'

/**
 * 背包标题栏额外信息（物品计数），供 Modal 的 extra 插槽使用
 */
export function InventoryExtra() {
  const inventory = useGameStore(state => state.inventory)
  const maxInventory = useGameStore(state => state.maxInventory)

  const itemCount = Object.keys(inventory).length
  const isNearFull = itemCount / maxInventory > 0.9

  return (
    <span className={`text-xs ${isNearFull ? 'text-mud-danger' : 'text-mud-text-dim'}`}>
      {itemCount}/{maxInventory}
    </span>
  )
}

export function Inventory() {
  const inventory = useGameStore(state => state.inventory)

  const inventoryEntries = Object.entries(inventory)
  const itemCount = inventoryEntries.length

  const { wrapperRef } = useBetterScroll<HTMLDivElement>({
    scrollY: true,
    deps: [itemCount],
  })

  return (
    // 物品列表 — BetterScroll wrapper
    <div
      ref={wrapperRef}
      className="h-60 md:h-72 overflow-hidden bg-mud-bg rounded p-2 font-mono text-xs relative"
    >
      {/* BetterScroll content — 必须是 wrapper 的唯一子元素 */}
      <div>
        {itemCount === 0 ? (
          <p className="text-mud-text-dim italic">背包是空的...</p>
        ) : (
          inventoryEntries.map(([itemId, count]) => {
            const item = getItem(itemId)
            if (!item) return null

            const typeLabel = ITEM_TYPE_LABEL[item.type] || item.type
            const typeColor = ITEM_TYPE_COLOR[item.type] || 'text-mud-text-dim'

            return (
              <div
                key={itemId}
                className="flex items-center justify-between py-1 border-b border-mud-bg-tertiary last:border-0"
              >
                {/* 物品信息 */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <ItemName item={item} />
                  <span className={`text-[10px] ${typeColor}`}>[{typeLabel}]</span>
                  <span className="text-mud-text-dim">x{count}</span>
                </div>

                {/* 使用按钮 */}
                {item.canUse && (
                  <button
                    onClick={() => useItem(itemId)}
                    className="text-mud-success hover:text-green-300 transition-colors cursor-pointer ml-2 shrink-0"
                  >
                    [使用]
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
