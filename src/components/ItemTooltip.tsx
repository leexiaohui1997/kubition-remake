/**
 * 物品信息浮窗组件
 *
 * 手动计算定位的通用物品详情浮窗。
 * 通过 React Portal 渲染到 body + position: fixed，
 * 彻底绕开 Modal(backdrop-filter) / BetterScroll(transform) 容器对定位的干扰。
 *
 * - PC 端：鼠标 hover 到触发元素 150ms 后显示，移出时关闭
 * - 移动端：手指按下期间显示，松开即关闭
 *
 * 使用方式：
 * ```tsx
 * <ItemTooltip item={item}>
 *   <span>{item.name}</span>
 * </ItemTooltip>
 * ```
 */

import { useState, useRef, useCallback, useLayoutEffect, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Item } from '@/types/game'
import { EFFECT_LABEL, WEAPON_TYPE_LABEL, EQUIP_SLOT_LABEL } from '@/constants/labels'

interface ItemTooltipProps {
  /** 物品数据 */
  item: Item
  /** 触发元素（children） */
  children: ReactNode
}

/**
 * 计算浮窗位置：优先显示在触发元素上方，空间不足时翻转到下方。
 * 水平方向自动偏移以避免超出视口。
 */
function calcPosition(triggerRect: DOMRect, floatingEl: HTMLDivElement) {
  const gap = 8
  const padding = 8 // 距离视口边缘的安全间距
  const floatingRect = floatingEl.getBoundingClientRect()

  // 水平居中对齐触发元素
  let left = triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2

  // 水平边界修正
  if (left < padding) left = padding
  if (left + floatingRect.width > window.innerWidth - padding) {
    left = window.innerWidth - padding - floatingRect.width
  }

  // 默认放在上方
  let top = triggerRect.top - floatingRect.height - gap

  // 上方空间不够 → 翻转到下方
  if (top < padding) {
    top = triggerRect.bottom + gap
  }

  return { top, left }
}

export function ItemTooltip({ item, children }: ItemTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [visible, setVisible] = useState(false) // 控制淡入动画

  const triggerRef = useRef<HTMLSpanElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const touchActiveRef = useRef(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 更新浮窗位置
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !floatingRef.current) return
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const newPos = calcPosition(triggerRect, floatingRef.current)
    setPos(newPos)
  }, [])

  // 浮窗打开后：先渲染以获取尺寸，再计算位置，最后触发淡入动画
  useLayoutEffect(() => {
    if (isOpen && floatingRef.current) {
      updatePosition()
      // 下一帧触发淡入
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [isOpen, updatePosition])

  // 监听滚动和 resize，实时更新位置
  useEffect(() => {
    if (!isOpen) return
    const handleUpdate = () => updatePosition()
    window.addEventListener('scroll', handleUpdate, true) // capture 以捕获所有滚动
    window.addEventListener('resize', handleUpdate)
    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [isOpen, updatePosition])

  // PC 端：鼠标 hover 150ms 后显示
  const handleMouseEnter = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => setIsOpen(true), 150)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setIsOpen(false)
  }, [])

  // 移动端：手指按下 → 显示，松开 → 关闭
  const handleTouchStart = useCallback(() => {
    touchActiveRef.current = true
    setIsOpen(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    touchActiveRef.current = false
    setIsOpen(false)
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    }
  }, [])

  return (
    <>
      {/* 触发元素 */}
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="cursor-help select-none"
      >
        {children}
      </span>

      {/* 浮窗 — Portal 到 body，使用 position: fixed 基于视口定位 */}
      {isOpen &&
        createPortal(
          <div
            ref={floatingRef}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 150ms ease-out, transform 150ms ease-out',
              pointerEvents: 'none',
            }}
            className="z-[9999] max-w-64 rounded border border-mud-bg-tertiary bg-mud-bg-secondary px-3 py-2 font-mono text-xs shadow-lg shadow-black/50"
          >
            <TooltipContent item={item} />
          </div>,
          document.body
        )}
    </>
  )
}

// ========================
// 浮窗内部内容
// ========================

/** 浮窗内容：根据物品类型动态渲染属性 */
function TooltipContent({ item }: { item: Item }) {
  return (
    <div className="space-y-1.5">
      {/* 描述 */}
      {item.desc && <p className="text-mud-text leading-relaxed">{item.desc}</p>}

      {/* 交易价值 */}
      {item.value != null && item.value > 0 && (
        <div className="text-mud-accent">
          价值: <span className="text-mud-text">{item.value} 金</span>
        </div>
      )}

      {/* 食物/药剂效果 */}
      {item.effect && <EffectSection effect={item.effect} />}

      {/* 武器属性 */}
      {item.weaponType && <WeaponSection item={item} />}

      {/* 装备属性 */}
      {item.equipType && <EquipSection item={item} />}
    </div>
  )
}

/** 食物/药剂效果展示 */
function EffectSection({ effect }: { effect: NonNullable<Item['effect']> }) {
  const entries = Object.entries(effect).filter(([, v]) => v !== 0 && v != null)
  if (entries.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
      {entries.map(([key, val]) => {
        const label = EFFECT_LABEL[key] || key
        const isPositive = val > 0
        return (
          <span key={key} className={isPositive ? 'text-mud-success' : 'text-mud-danger'}>
            {label}
            {isPositive ? '+' : ''}
            {val}
          </span>
        )
      })}
    </div>
  )
}

/** 武器属性展示 */
function WeaponSection({ item }: { item: Item }) {
  return (
    <div className="space-y-0.5 border-t border-mud-bg-tertiary pt-1.5">
      <div className="text-mud-text-dim">
        [{WEAPON_TYPE_LABEL[item.weaponType!] || item.weaponType}武器]
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {item.damage != null && (
          <span>
            伤害 <span className="text-red-400">{item.damage}</span>
          </span>
        )}
        {item.range != null && (
          <span>
            射程 <span className="text-mud-info">{item.range}</span>
          </span>
        )}
        {item.durable != null && (
          <span>
            耐久 <span className="text-mud-accent">{item.durable}</span>
          </span>
        )}
      </div>

      {/* 弹药需求 */}
      {item.bullet && <div className="text-mud-text-dim">弹药: {item.bullet}</div>}

      {/* 特殊效果 */}
      {item.frozen != null && item.frozen > 0 && (
        <div className="text-blue-300">冻结 {Math.round(item.frozen * 100)}%</div>
      )}
      {item.fear != null && item.fear > 0 && (
        <div className="text-purple-300">恐惧 {Math.round(item.fear * 100)}%</div>
      )}
      {item.block != null && item.block > 0 && (
        <div className="text-mud-accent">格挡 {Math.round(item.block * 100)}%</div>
      )}
      {item.curse != null && item.curse > 0 && (
        <div className="text-purple-400">诅咒 {Math.round(item.curse * 100)}%敌方最大生命</div>
      )}
      {item.dmgTo && (
        <div className="text-green-300">
          {Math.round(item.dmgTo.buff * 100)}%伤害转化为
          {item.dmgTo.target === 'hp' ? '生命' : '体力'}
        </div>
      )}

      {/* 使用消耗 */}
      {item.require && Object.keys(item.require).length > 0 && (
        <div className="text-mud-text-dim">
          消耗:{' '}
          {Object.entries(item.require)
            .map(([k, v]) => `${EFFECT_LABEL[k] || k}${v}`)
            .join(' ')}
        </div>
      )}
    </div>
  )
}

/** 装备属性展示 */
function EquipSection({ item }: { item: Item }) {
  const details: string[] = []

  // 伤害加成
  if (item.meleeMul) details.push(`近战+${Math.round(item.meleeMul * 100)}%`)
  if (item.magicMul) details.push(`魔法+${Math.round(item.magicMul * 100)}%`)
  if (item.shootMul) details.push(`远程+${Math.round(item.shootMul * 100)}%`)

  // 受伤倍率
  if (item.dmgMul != null && item.dmgMul !== 1) {
    const reduction = Math.round((1 - item.dmgMul) * 100)
    if (reduction > 0) {
      details.push(`减伤${reduction}%`)
    } else {
      details.push(`额外受伤${Math.abs(reduction)}%`)
    }
  }

  // 射程加成
  if (item.agileInc) details.push(`射程${item.agileInc > 0 ? '+' : ''}${item.agileInc}`)

  // 冻结装甲
  if (item.frozenArm) details.push(`冻结敌人${Math.round(item.frozenArm * 100)}%`)

  // 格挡
  if (item.block) details.push(`格挡${Math.round(item.block * 100)}%`)

  // 消耗减少
  if (item.meleeCostDec != null && item.meleeCostDec > 0)
    details.push(`近战消耗-${Math.round(item.meleeCostDec * 100)}%`)
  if (item.magicCostDec != null && item.magicCostDec > 0)
    details.push(`魔法消耗-${Math.round(item.magicCostDec * 100)}%`)
  if (item.shootCostDec != null && item.shootCostDec > 0)
    details.push(`远程消耗-${Math.round(item.shootCostDec * 100)}%`)

  // 体温相关
  if (item.tempBuff) details.push(`环境温度${item.tempBuff > 0 ? '+' : ''}${item.tempBuff}`)
  if (item.tempDownMul != null && item.tempDownMul < 1)
    details.push(`减缓降温${Math.round((1 - item.tempDownMul) * 100)}%`)
  if (item.tempUpMul != null && item.tempUpMul < 1)
    details.push(`减缓升温${Math.round((1 - item.tempUpMul) * 100)}%`)

  // 采集速度
  if (item.collectSpeed) details.push(`采集加速${Math.round(item.collectSpeed * 100)}%`)

  // 移动速度
  if (item.moveFaster) details.push(`移动加速${Math.round(item.moveFaster * 100)}%`)

  // 逃跑几率
  if (item.runChanceMul != null && item.runChanceMul < 1)
    details.push(`逃跑+${Math.round((1 - item.runChanceMul) * 100)}%`)

  // 伤害转化
  if (item.dmgTo) {
    details.push(
      `${Math.round(item.dmgTo.buff * 100)}%伤害→${item.dmgTo.target === 'hp' ? '生命' : '体力'}`
    )
  }

  // 每小时恢复
  if (item.rec) {
    Object.entries(item.rec).forEach(([k, v]) => {
      if (v) details.push(`每时${EFFECT_LABEL[k] || k}${v > 0 ? '+' : ''}${v}`)
    })
  }

  return (
    <div className="space-y-0.5 border-t border-mud-bg-tertiary pt-1.5">
      <div className="text-mud-text-dim">
        [装备 · {EQUIP_SLOT_LABEL[item.equipType!] || item.equipType}]
      </div>
      {details.length > 0 && (
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          {details.map((d, i) => (
            <span key={i} className="text-mud-info">
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
