/**
 * 场景外壳布局组件
 *
 * 封装所有场景共用的外壳结构：
 * - 标题 + 描述
 * - 分隔线
 * - 本地操作区（带 BetterScroll 滚动容器，内容多时可滚动）
 * - 额外区域插槽（如配方列表，可选）
 * - 旅行操作区（固定在底部，不参与滚动）
 */

import type { ReactNode } from 'react'
import { useBetterScroll } from '@/hooks/useBetterScroll'

interface SceneLayoutProps {
  /** 场景标题 */
  title: string
  /** 场景描述文字 */
  desc?: string
  /** 本地操作列表（放入滚动容器） */
  localActions?: ReactNode
  /** 本地操作区标签 */
  localLabel?: string
  /** 额外内容区域，如配方列表（可选，位于本地操作与旅行操作之间） */
  extraSection?: ReactNode
  /** 旅行/移动操作（固定在底部，不参与滚动） */
  travelActions?: ReactNode
}

export function SceneLayout({
  title,
  desc,
  localActions,
  localLabel = '可执行的操作',
  extraSection,
  travelActions,
}: SceneLayoutProps) {
  const { wrapperRef } = useBetterScroll<HTMLDivElement>({
    scrollY: true,
  })

  return (
    <div className="bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-4">
      {/* 场景标题 */}
      <h2 className="text-lg font-bold text-mud-accent mb-2">{title}</h2>

      {/* 场景描述 */}
      {desc && (
        <p className="text-sm text-mud-text-dim mb-4 leading-relaxed break-words">{desc}</p>
      )}

      {/* 分隔线 */}
      <div className="border-t border-mud-bg-tertiary my-3" />

      {/* 本地操作区（BetterScroll 滚动容器） */}
      {localActions && (
        <div className="mb-2">
          <p className="text-xs text-mud-text-dim mb-2">{localLabel}：</p>
          {/* BetterScroll wrapper：固定高度，overflow hidden */}
          <div ref={wrapperRef} className="max-h-64 overflow-hidden relative">
            {/* BetterScroll content：实际内容节点 */}
            <div className="space-y-1 pr-1">
              {localActions}
            </div>
          </div>
        </div>
      )}

      {/* 额外内容区域（如配方列表） */}
      {extraSection && (
        <div className="mt-2">
          {extraSection}
        </div>
      )}

      {/* 旅行操作区（不参与滚动，固定在底部） */}
      {travelActions && (
        <>
          <div className="border-t border-mud-bg-tertiary my-3" />
          <div className="space-y-1">
            {travelActions}
          </div>
        </>
      )}
    </div>
  )
}
