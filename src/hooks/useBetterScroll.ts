/**
 * useBetterScroll — BetterScroll 通用 Hook
 *
 * 封装 BScroll 实例的创建 / 销毁 / 刷新，
 * 内置 mouseWheel、scrollbar、observeDOM 三个插件。
 *
 * @example
 * ```tsx
 * const { wrapperRef, scrollTo } = useBetterScroll<HTMLDivElement>({
 *   scrollY: true,
 *   autoScrollBottom: true,
 *   deps: [logs.length],
 * })
 * return (
 *   <div ref={wrapperRef}>
 *     <div>{content}</div>
 *   </div>
 * )
 * ```
 */

import { useEffect, useRef, useCallback } from 'react'
import BScroll from '@better-scroll/core'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import MouseWheel from '@better-scroll/mouse-wheel'
import ScrollBar from '@better-scroll/scroll-bar'
import ObserveDOM from '@better-scroll/observe-dom'

// 注册插件（全局只需一次）
BScroll.use(MouseWheel)
BScroll.use(ScrollBar)
BScroll.use(ObserveDOM)

/** Hook 配置项 */
export interface UseBetterScrollOptions {
  /**
   * 开启纵向滚动（默认 true）
   */
  scrollY?: boolean
  /**
   * 开启横向滚动（默认 false）
   */
  scrollX?: boolean
  /**
   * 内容变化时自动滚到底部（默认 false）
   * 常用于聊天等尾部追加内容的场景
   */
  autoScrollBottom?: boolean
  /**
   * 内容变化时自动滚到顶部（默认 false）
   * 常用于日志面板等头部插入内容的场景
   */
  autoScrollTop?: boolean
  /**
   * 自动滚动的动画时长，单位 ms（默认 300）
   */
  scrollDuration?: number
  /**
   * 外部依赖，变化时触发 refresh + 可选的自动滚底
   */
  deps?: unknown[]
  /**
   * 透传给 BScroll 的额外配置（会与默认配置合并）
   */
  bsOptions?: Partial<ConstructorParameters<typeof BScroll>[1]>
}

export function useBetterScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseBetterScrollOptions = {},
) {
  const {
    scrollY = true,
    scrollX = false,
    autoScrollBottom = false,
    autoScrollTop = false,
    scrollDuration = 300,
    deps = [],
    bsOptions = {},
  } = options

  const wrapperRef = useRef<T>(null)
  const bsRef = useRef<BScrollConstructor | null>(null)

  /* ---------- 初始化 & 销毁 ---------- */
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const bs = new BScroll(wrapper as HTMLElement, {  // eslint-disable-line
      scrollY,
      scrollX,
      click: true,
      // 回弹效果
      bounce: true,
      // 鼠标滚轮
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300,
      },
      // 自定义滚动条
      scrollbar: {
        fade: true,
        interactive: true,
        scrollbarTrackClickable: true,
      },
      // 自动监听 DOM 变化并 refresh
      observeDOM: true,
      // 合并用户自定义配置
      ...bsOptions,
    }) as unknown as BScrollConstructor

    bsRef.current = bs

    return () => {
      bs.destroy()
      bsRef.current = null
    }
    // 仅在挂载/卸载时执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- 依赖变化 → refresh + 自动滚底 ---------- */
  useEffect(() => {
    const bs = bsRef.current
    if (!bs) return

    // 等待下一帧，确保 DOM 已更新
    requestAnimationFrame(() => {
      bs.refresh()

      if (autoScrollBottom) {
        bs.scrollTo(0, bs.maxScrollY, scrollDuration)
      } else if (autoScrollTop) {
        bs.scrollTo(0, 0, scrollDuration)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  /* ---------- 暴露的便捷方法 ---------- */

  /** 滚动到指定坐标 */
  const scrollTo = useCallback((x: number, y: number, time = 300) => {
    bsRef.current?.scrollTo(x, y, time)
  }, [])

  /** 滚动到底部 */
  const scrollToBottom = useCallback(
    (time = 300) => {
      const bs = bsRef.current
      if (bs) {
        bs.refresh()
        bs.scrollTo(0, bs.maxScrollY, time)
      }
    },
    [],
  )

  /** 滚动到顶部 */
  const scrollToTop = useCallback(
    (time = 300) => {
      const bs = bsRef.current
      if (bs) {
        bs.refresh()
        bs.scrollTo(0, 0, time)
      }
    },
    [],
  )

  /** 手动刷新 */
  const refresh = useCallback(() => {
    bsRef.current?.refresh()
  }, [])

  return {
    /** 绑定到 wrapper 容器的 ref */
    wrapperRef,
    /** BScroll 实例 ref（可用于高级操作） */
    bsRef,
    /** 滚动到指定坐标 */
    scrollTo,
    /** 滚动到底部 */
    scrollToBottom,
    /** 滚动到顶部 */
    scrollToTop,
    /** 手动刷新滚动区域 */
    refresh,
  }
}
