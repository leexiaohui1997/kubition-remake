/**
 * 数据加载与验证工具
 * 提供统一的数据访问入口和交叉引用一致性验证
 */
import { ITEMS } from '@/data/items'
import { MONSTERS } from '@/data/monsters'
import { PLACES } from '@/data/places'
import { ALL_RECIPES } from '@/data/recipes'
import { DUNGEON_FLOORS } from '@/data/dungeons'

/** 统一数据访问入口 */
export const DataLoader = {
  /** 全部物品数据 */
  items: ITEMS,
  /** 全部怪物数据 */
  monsters: MONSTERS,
  /** 全部地点数据 */
  places: PLACES,
  /** 全部配方数据 */
  recipes: ALL_RECIPES,
  /** 全部地牢层级数据 */
  dungeons: DUNGEON_FLOORS,

  /**
   * 验证所有数据的交叉引用一致性
   * @returns 验证是否全部通过
   */
  validate(): boolean {
    const errors: string[] = []

    // 1. 检查配方材料引用的物品ID是否存在
    Object.entries(ALL_RECIPES).forEach(([recipeId, recipe]) => {
      Object.keys(recipe.materials).forEach(itemId => {
        if (!ITEMS[itemId]) {
          errors.push(`[配方] "${recipeId}" 的材料引用了不存在的物品: "${itemId}"`)
        }
      })
    })

    // 2. 检查配方产出的物品ID是否存在（产出ID默认等于配方ID）
    Object.entries(ALL_RECIPES).forEach(([recipeId]) => {
      // 配方ID即为产出物品ID，检查是否在ITEMS中存在
      if (!ITEMS[recipeId]) {
        errors.push(`[配方] "${recipeId}" 的产出物品在ITEMS中不存在`)
      }
    })

    // 3. 检查地点资源掉落的物品ID是否存在
    Object.entries(PLACES).forEach(([placeId, place]) => {
      if (place.resources) {
        place.resources.forEach(resource => {
          Object.keys(resource.drops).forEach(itemId => {
            if (!ITEMS[itemId]) {
              errors.push(
                `[地点] "${placeId}" 的资源 "${resource.id}" 掉落了不存在的物品: "${itemId}"`
              )
            }
          })

          // 4. 检查地点资源所需工具的物品ID是否存在
          if (resource.requiredTool) {
            Object.keys(resource.requiredTool).forEach(toolId => {
              if (!ITEMS[toolId]) {
                errors.push(
                  `[地点] "${placeId}" 的资源 "${resource.id}" 需要不存在的工具: "${toolId}"`
                )
              }
            })
          }
        })
      }

      // 检查地面可拾取物品
      if (place.things) {
        Object.keys(place.things).forEach(itemId => {
          if (!ITEMS[itemId]) {
            errors.push(`[地点] "${placeId}" 的地面物品引用了不存在的物品: "${itemId}"`)
          }
        })
      }
    })

    // 5. 检查地牢层级引用的怪物ID是否存在
    Object.entries(DUNGEON_FLOORS).forEach(([floorNum, floor]) => {
      Object.keys(floor.monsterWeights).forEach(mstId => {
        if (!MONSTERS[mstId]) {
          errors.push(`[地牢] 第${floorNum}层引用了不存在的怪物: "${mstId}"`)
        }
      })

      // 检查地牢奖励物品
      floor.rewards.forEach((reward, idx) => {
        Object.keys(reward.things).forEach(itemId => {
          if (!ITEMS[itemId]) {
            errors.push(`[地牢] 第${floorNum}层的第${idx + 1}个奖励引用了不存在的物品: "${itemId}"`)
          }
        })
      })
    })

    // 6. 检查怪物的 reward 和 chanceGet 引用的物品ID是否存在
    Object.entries(MONSTERS).forEach(([mstId, monster]) => {
      if (monster.reward) {
        Object.keys(monster.reward).forEach(itemId => {
          if (!ITEMS[itemId]) {
            errors.push(`[怪物] "${mstId}" 的固定奖励引用了不存在的物品: "${itemId}"`)
          }
        })
      }
      if (monster.chanceGet) {
        Object.keys(monster.chanceGet).forEach(itemId => {
          if (!ITEMS[itemId]) {
            errors.push(`[怪物] "${mstId}" 的概率掉落引用了不存在的物品: "${itemId}"`)
          }
        })
      }
    })

    // 输出结果
    if (errors.length > 0) {
      console.error(`❌ 数据验证发现 ${errors.length} 个问题:`)
      errors.forEach(err => console.error('  ' + err))
      return false
    }

    console.log('✅ 数据验证通过')
    return true
  },
}
