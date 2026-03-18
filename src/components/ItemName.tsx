/**
 * 物品名称组件
 *
 * 统一展示物品名称，根据物品类型显示对应颜色，并自动包裹 ItemTooltip。
 * 调用方只需传入包含 id 的 Partial<Item>，组件内部会自动补全完整数据。
 */

import type { Item } from '@/types/game'
import { getItem } from '@/data/items'
import { ItemTooltip } from '@/components/ItemTooltip'
import { ITEM_TYPE_COLOR } from '@/constants/styles'

interface ItemNameProps {
  /** 物品数据，至少包含 id，其余字段可选（组件内部会通过 getItem 补全） */
  item: Partial<Item> & { id: string }
  /** 额外的 CSS 类名 */
  className?: string
  /** 是否截断超长文本，默认 true */
  truncate?: boolean
}

export function ItemName({ item, className = '', truncate = true }: ItemNameProps) {
  // 用 getItem 补全完整数据，再与传入的 item 合并（传入字段优先）
  const fullItem = { ...getItem(item.id), ...item } as Item

  const color = ITEM_TYPE_COLOR[fullItem.type] ?? 'text-mud-text-dim'
  const truncateClass = truncate ? 'truncate' : ''

  return (
    <ItemTooltip item={fullItem}>
      <span className={`${color} ${truncateClass} ${className}`.trim()}>
        {fullItem.name ?? item.id}
      </span>
    </ItemTooltip>
  )
}
