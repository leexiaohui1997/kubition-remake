/**
 * 进度条覆盖层组件
 *
 * 在场景内容上方叠加半透明遮罩 + 进度条，
 * 用于移动、采集、制造等需要等待的行动。
 * 仅在 `visible` 为 true 时渲染。
 */

interface ProgressOverlayProps {
  /** 是否显示覆盖层 */
  visible: boolean
  /** 进度值（0~100） */
  progress: number
  /** 提示文字，支持 animate-pulse 动画 */
  label: string
  /**
   * 进度条颜色 Tailwind 类名
   * @example "bg-mud-info" | "bg-mud-success" | "bg-mud-warning"
   */
  barColor: string
}

export function ProgressOverlay({ visible, progress, label, barColor }: ProgressOverlayProps) {
  if (!visible) return null

  return (
    <div className="absolute inset-0 bg-mud-bg/90 flex flex-col items-center justify-center rounded z-10">
      <p className={`text-sm mb-3 animate-pulse ${barColor.replace('bg-', 'text-')}`}>
        {label}
      </p>
      {/* 进度条容器 */}
      <div className="w-3/4 max-w-xs h-3 bg-mud-bg-tertiary rounded overflow-hidden border border-mud-bg-tertiary">
        <div
          className={`h-full transition-all duration-100 ease-linear rounded ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-mud-text-dim text-xs mt-2">{Math.round(progress)}%</p>
    </div>
  )
}
