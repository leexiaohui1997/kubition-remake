/**
 * 游戏 UI 展示用的中文标签映射
 *
 * 将游戏内枚举值（英文 key）映射为用户可读的中文名称。
 * 所有组件统一从此文件导入，避免各处重复定义。
 */

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
export const ITEM_TYPE_LABEL: Record<string, string> = {
  food: '食材',
  cooked: '食品',
  weapon: '武器',
  equip: '装备',
  met: '材料',
  bullet: '弹药',
  poizon: '药剂',
  tool: '道具',
  quest: '任务',
  seed: '种子',
  art: '工艺品',
  special: '特殊',
}
