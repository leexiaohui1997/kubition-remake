/**
 * 通用弹层组件（Modal）
 *
 * 提供遮罩层、ESC 关闭、点击遮罩关闭、入场动画、可选标题栏等通用能力。
 * 所有弹层面板（背包、技能树、商店等）均可复用。
 *
 * @example
 * ```tsx
 * <Modal open={showInventory} onClose={() => setShowInventory(false)} title="背包">
 *   <InventoryContent />
 * </Modal>
 * ```
 */

import { useEffect, type ReactNode } from 'react'

export interface ModalProps {
  /** 是否显示弹层 */
  open: boolean
  /** 关闭弹层的回调 */
  onClose: () => void
  /** 弹层标题（可选） */
  title?: string
  /** 标题右侧的额外内容（可选，如计数器、状态等） */
  extra?: ReactNode
  /** 弹层内容 */
  children: ReactNode
  /** 自定义面板宽度类名，默认 'w-[90vw] max-w-md' */
  widthClass?: string
}

export function Modal({
  open,
  onClose,
  title,
  extra,
  children,
  widthClass = 'w-[90vw] max-w-md',
}: ModalProps) {
  // ESC 键关闭弹层
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    // 遮罩层
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* 弹层面板 — 阻止点击冒泡 */}
      <div
        className={`bg-mud-bg-secondary border border-mud-bg-tertiary rounded p-4 shadow-lg shadow-black/50 animate-slide-up ${widthClass}`}
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 — 仅在有 title 时渲染 */}
        {title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-mud-accent">{title}</h3>
            <div className="flex items-center gap-3">
              {extra}
              <button
                onClick={onClose}
                className="text-xs text-mud-text-dim hover:text-mud-warning transition-colors cursor-pointer"
              >
                [关闭]
              </button>
            </div>
          </div>
        )}

        {/* 内容区域 */}
        {children}
      </div>
    </div>
  )
}
