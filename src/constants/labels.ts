/**
 * 游戏 UI 展示用的中文标签映射
 *
 * 将游戏内枚举值（英文 key）映射为用户可读的中文名称。
 * 所有组件统一从此文件导入，避免各处重复定义。
 */

import { ItemType } from '@/types/game'

/** 效果属性中文映射 */
export const EFFECT_LABEL: Record<string, string> = {
  full: '饱食',
  moist: '水分',
  hp: '生命',
  ps: '体力',
  san: '理智',
  temp: '体温',
}

/** 武器类型中文映射 */
export const WEAPON_TYPE_LABEL: Record<string, string> = {
  melee: '近战',
  shoot: '远程',
  magic: '魔法',
}

/** 装备槽位中文映射 */
export const EQUIP_SLOT_LABEL: Record<string, string> = {
  head: '头部',
  body: '身体',
  hand: '手部',
  foot: '脚部',
  neck: '颈部',
}

/** 物品类型中文映射 */
export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  // ── 普通物品 ──
  [ItemType.Food]:    '食材',
  [ItemType.Cooked]:  '熟食',
  [ItemType.Weapon]:  '武器',
  [ItemType.Equip]:   '装备',
  [ItemType.Met]:     '材料',
  [ItemType.Bullet]:  '弹药',
  [ItemType.Poizon]:  '毒药',
  [ItemType.Tool]:    '道具',
  [ItemType.Quest]:   '任务',
  [ItemType.Seed]:    '种子',
  [ItemType.Art]:     '艺术品',
  [ItemType.Special]: '特殊',
  // ── 科技树节点 ──
  [ItemType.UnknownBonus]:       '科技·解锁',
  [ItemType.BigBoxSizeBonus]:    '科技·箱子扩容',
  [ItemType.BagSizeBonus]:       '科技·背包扩容',
  [ItemType.FarmSizeBonus]:      '科技·农田扩建',
  [ItemType.AlcoSizeBonus]:      '科技·酒桶扩建',
  [ItemType.TrapSizeBonus]:      '科技·陷阱扩容',
  [ItemType.WellBonus]:          '科技·水井产量',
  [ItemType.MakeSpeed]:          '科技·制作速度',
  [ItemType.CookerUpdate]:       '科技·炊具升级',
  [ItemType.DurableUpdate]:      '科技·锻造强化',
  [ItemType.MagicDurableUpdate]: '科技·魔法提炼',
  [ItemType.CollectDec]:         '科技·采集优化',
  [ItemType.TrapChance]:         '科技·陷阱效率',
  [ItemType.TrapGet]:            '科技·陷阱收益',
  [ItemType.LockUpdate]:         '科技·门锁升级',
  [ItemType.SecurityBox]:        '科技·保险箱',
  [ItemType.MapBonus]:           '科技·地图测绘',
  [ItemType.BeaconMax]:          '科技·商队马车',
  [ItemType.SleepPlace]:         '科技·睡眠设施',
  [ItemType.ShowerPlace]:        '科技·洗浴设施',
}
