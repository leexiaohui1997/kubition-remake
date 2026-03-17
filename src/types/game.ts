/**
 * 游戏核心数据类型定义
 * 所有类型忠实反映原始项目 KuBiTionAdvanture 的数据结构
 */

// ========================
// 枚举 / 联合类型
// ========================

/** 物品类型（与原始项目 TYPE_DATA 一致） */
export type ItemType =
  | 'food' // 食材
  | 'cooked' // 食品（烹饪后）
  | 'weapon' // 武器
  | 'equip' // 装备
  | 'met' // 材料
  | 'bullet' // 弹药
  | 'poizon' // 药剂（原始数据使用 poizon）
  | 'tool' // 道具
  | 'quest' // 任务物品
  | 'seed' // 种子
  | 'art' // 工艺品
  | 'special' // 技能提升
  // 以下为科技/建筑相关物品类型
  | 'securityBox' // 保险箱
  | 'makeSpeed' // 制作速度加成
  | 'collectDec' // 采集消耗减少
  | 'trapGet' // 陷阱收益加成
  | 'trapChance' // 捕获几率加成
  | 'lockUpdate' // 锁具升级
  | 'durableUpdate' // 耐久升级
  | 'magicDurableUpdate' // 魔法耐久升级
  | 'cookerUpdate' // 烹饪台升级
  | 'bagSizeBonus' // 背包容量加成
  | 'bigBoxSizeBonus' // 大箱子容量加成
  | 'farmSizeBonus' // 农田容量加成
  | 'trapSizeBonus' // 陷阱容量加成
  | 'alcoSizeBonus' // 酿酒容量加成
  | 'wellBonus' // 水井加成
  | 'mapBonus' // 地图加成
  | 'beaconMax' // 信标上限
  | 'unknownBonus' // 未知加成
  | 'sleepPlace' // 睡眠设施
  | 'showerPlace' // 洗浴设施

/** 武器类型 */
export type WeaponType = 'melee' | 'shoot' | 'magic'

/** 装备槽位 */
export type EquipSlot = 'head' | 'body' | 'hand' | 'foot' | 'neck'

// ========================
// 物品效果
// ========================

/** 使用物品时的效果（食物/药剂） */
export interface ItemEffect {
  /** 饱食度变化 */
  full?: number
  /** 水分变化 */
  moist?: number
  /** 生命值变化 */
  hp?: number
  /** 体力变化 */
  ps?: number
  /** 理智变化 */
  san?: number
  /** 体温变化 */
  temp?: number
}

/** 伤害转化效果（吸血/吸蓝等） */
export interface DmgToEffect {
  /** 转化目标属性 */
  target: 'hp' | 'ps'
  /** 转化系数 */
  buff: number
}

// ========================
// 物品接口
// ========================

/** 物品定义 */
export interface Item {
  /** 物品ID（运行时注入） */
  id: string
  /** 物品名称 */
  name: string
  /** 物品类型 */
  type: ItemType
  /** 描述 */
  desc?: string
  /** 交易价值 */
  value?: number
  /** 是否可使用 */
  canUse?: boolean
  /** 音效 */
  sound?: string

  // —— 食物/药剂属性 ——
  /** 使用效果 */
  effect?: ItemEffect
  /** 是否为饮品 */
  isDrink?: boolean

  // —— 武器属性 ——
  /** 武器类型 */
  weaponType?: WeaponType
  /** 伤害值 */
  damage?: number
  /** 射程/攻击范围 */
  range?: number
  /** 耐久度 */
  durable?: number
  /** 弹药类型ID */
  bullet?: string
  /** 使用消耗（如 ps、san、hp 等） */
  require?: Record<string, number>
  /** 恐惧概率 */
  fear?: number
  /** 冻结效果 */
  frozen?: number
  /** 格挡概率 */
  block?: number
  /** 诅咒系数（附加敌人最大HP百分比伤害） */
  curse?: number
  /** 耐久衰减加伤（true 或数值） */
  durableDec?: boolean | number
  /** 伤害转化效果 */
  dmgTo?: DmgToEffect
  /** 科技需求 */
  science?: string
  /** 轮回次数加伤 */
  reiToDmg?: number

  // —— 装备属性 ——
  /** 装备槽位 */
  equipType?: EquipSlot
  /** 防御值 */
  defense?: number
  /** 近战伤害倍率加成 */
  meleeMul?: number
  /** 魔法伤害倍率加成 */
  magicMul?: number
  /** 远程伤害倍率加成 */
  shootMul?: number
  /** 受伤倍率 */
  dmgMul?: number
  /** 射程加成 */
  agileInc?: number
  /** 冻结装甲（几率冻结敌人） */
  frozenArm?: number
  /** 体温加成 */
  tempBuff?: number
  /** 轮回次数加防 */
  reiToDef?: number
  /** 轮回次数加攻 */
  reiToAtk?: number
  /** 采集速度加成 */
  collectSpeed?: number
  /** 体力百分比减伤 */
  psToDef?: boolean | number
  /** 近战消耗减少系数 */
  meleeCostDec?: number
  /** 魔法消耗减少系数 */
  magicCostDec?: number
  /** 远程消耗减少系数 */
  shootCostDec?: number
  /** 体温上升速度倍率 */
  tempUpMul?: number
  /** 体温下降速度倍率 */
  tempDownMul?: number
  /** 战斗遭遇几率倍率 */
  battleChanceMul?: number
  /** 宝箱奖励几率倍率 */
  rewardChanceMul?: number
  /** 逃跑成功几率倍率 */
  runChanceMul?: number
  /** 移动速度加成 */
  moveFaster?: number
  /** 每小时自动恢复效果 */
  rec?: Partial<Record<'hp' | 'ps' | 'san' | 'full', number>>
  /** HP百分比转魔法伤害 */
  hpTo_magic?: number

  // —— 道具特殊属性 ——
  /** 耐久恢复类型 */
  durableRec?: string
  /** 耐久恢复数量 */
  durableAmount?: number

  // —— 特殊物品属性 ——
  /** 技能提升类型 */
  upgrade?: string
}

// ========================
// 怪物接口
// ========================

/** 怪物前缀（精英怪属性加成） */
export interface MonsterPrefix {
  /** 前缀名称 */
  name: string
  /** 属性加成系数 */
  buff?: number
}

/** 怪物定义 */
export interface Monster {
  /** 怪物ID（运行时注入） */
  id: string
  /** 怪物名称 */
  name: string
  /** 最大生命值 */
  maxHp: number
  /** 伤害值 */
  damage: number
  /** 攻击范围 */
  range: number
  /** 血量乘数（BOSS用） */
  hpMul?: number
  /** 追击概率（0-1 或 100 表示必追） */
  chaseChance?: number
  /** 固定奖励 */
  reward?: Record<string, number>
  /** 概率掉落 */
  chanceGet?: Record<string, number>
  /** 描述 */
  desc?: string
}

// ========================
// 地点 / 资源接口
// ========================

/** 资源节点定义 */
export interface ResourceNode {
  /** 资源节点ID（运行时注入） */
  id: string
  /** 资源名称 */
  name: string
  /** 操作动作名称 */
  actionName: string
  /** 采集耗时 */
  timeCost: number
  /** 产出物品及数量 */
  drops: Record<string, number>
  /** 体力消耗 */
  psCost?: number
  /** 生命值消耗 */
  hpCost?: number
  /** 所需工具（工具ID → 数量） */
  requiredTool?: Record<string, number>
  /** 刷新率 */
  circle?: number
  /** 初始数量 */
  initAmount?: number
  /** 需要事件 */
  event?: string
}

/** 地点怪物配置 */
export interface PlaceMonster {
  /** 平衡数量 */
  balancedAmount: number
}

/** 地点定义 */
export interface Place {
  /** 地点ID（运行时注入） */
  id: string
  /** 地点名称 */
  name: string
  /** 移动耗时 */
  timeNeed: number
  /** 描述 */
  desc?: string
  /** 资源节点列表 */
  resources?: ResourceNode[]
  /** 地点怪物及平衡数量 */
  monsters?: Record<string, PlaceMonster>
  /** 地面可拾取物品 */
  things?: Record<string, number>
  /** 环境温度 */
  temp?: number
  /** 进入条件事件 */
  requireEvent?: string
  /** 可触发事件 */
  events?: Record<string, boolean | number>
  /** 需要科技 */
  science?: string
}

// ========================
// 配方接口
// ========================

/** 配方分类 */
export type RecipeCategory = 'smith' | 'alchemy' | 'magic' | 'science'

/** 配方定义 */
export interface Recipe {
  /** 配方ID（运行时注入） */
  id: string
  /** 配方名称（来自物品名称或配方ID） */
  name: string
  /** 配方分类 */
  category: RecipeCategory
  /** 制作耗时 */
  timeCost: number
  /** 所需材料（物品ID → 数量） */
  materials: Record<string, number>
  /** 产出数量（默认1） */
  amount?: number
  /** 前置科技 */
  requiredScience?: string
  /** 需要建筑 */
  requiredBuilding?: string
  /** 需要事件 */
  requiredEvent?: string
  /** 描述 */
  desc?: string
}

// ========================
// 地牢接口
// ========================

/** 地牢宝箱奖励 */
export interface DungeonReward {
  /** 奖励物品（物品ID → 数量） */
  things: Record<string, number>
  /** 获得概率 */
  chance: number
}

/** 地牢层级定义 */
export interface DungeonFloor {
  /** 层数 */
  floor: number
  /** 怪物权重（怪物ID → 权重） */
  monsterWeights: Record<string, number>
  /** 宝箱奖励列表 */
  rewards: DungeonReward[]
}
