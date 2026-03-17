/**
 * 地牢数据 - 全量迁移自原始项目 KuBiTionAdvanture/src/data_dungeon.js
 * 本文件由脚本自动生成，请勿手动修改
 */
import type { DungeonFloor } from '@/types/game'

/** 全部地牢层级数据 */
export const DUNGEON_FLOORS: Record<number, DungeonFloor> = {
  1: {
    floor: 1,
    monsterWeights: { creeper: 10, woodMan: 10, skeleton: 10, dust: 3 },
    rewards: [
      { things: { iceBumb: 3 }, chance: 0.005 },
      { things: { teethAxe: 1 }, chance: 0.005 },
      { things: { staff: 1 }, chance: 0.005 },
      { things: { bread: 1 }, chance: 0.05 },
      { things: { beer: 1 }, chance: 0.1 },
      { things: { hpPotion: 1 }, chance: 0.05 },
      { things: { psPotion: 1 }, chance: 0.05 },
      { things: { gold: 60 }, chance: 0.05 },
      { things: { humanMeat: 1 }, chance: 0.01 },
    ],
  },
  2: {
    floor: 2,
    monsterWeights: { witch: 10, bat: 10, skeletonShooter: 10, fishman: 10, plant: 3 },
    rewards: [
      { things: { dust: 4 }, chance: 0.05 },
      { things: { crystal: 5 }, chance: 0.01 },
      { things: { gem: 5 }, chance: 0.01 },
      { things: { gold: 10 }, chance: 0.01 },
    ],
  },
  3: {
    floor: 3,
    monsterWeights: { witch_2: 10, witch_3: 10, griffin: 6, machine: 5, snake: 5 },
    rewards: [
      { things: { darkDust: 2 }, chance: 0.025 },
      { things: { crystal: 5 }, chance: 0.02 },
      { things: { gem: 5 }, chance: 0.02 },
      { things: { gold: 10 }, chance: 0.02 },
    ],
  },
  4: {
    floor: 4,
    monsterWeights: {
      woodMan_2: 10,
      metalBat: 10,
      magicPlant: 10,
      mithrilSmith: 8,
      fireSnake: 2,
      springSprite: 1,
    },
    rewards: [
      { things: { mithril: 2 }, chance: 0.1 },
      { things: { darkGold: 2 }, chance: 0.01 },
      { things: { darkDust: 2 }, chance: 0.05 },
      { things: { crystal: 5 }, chance: 0.03 },
      { things: { gem: 5 }, chance: 0.03 },
      { things: { gold: 5 }, chance: 0.03 },
    ],
  },
  5: {
    floor: 5,
    monsterWeights: {
      magicFrog: 20,
      darkBat: 10,
      shootSnake: 10,
      mithril: 8,
      woodMan_3: 1,
      witch_4: 1,
      group: 1,
    },
    rewards: [
      { things: { mithril: 4 }, chance: 0.1 },
      { things: { darkGold: 2 }, chance: 0.01 },
      { things: { darkDust: 2 }, chance: 0.05 },
      { things: { crystal: 5 }, chance: 0.03 },
      { things: { gem: 5 }, chance: 0.03 },
      { things: { gold: 5 }, chance: 0.03 },
    ],
  },
  6: {
    floor: 6,
    monsterWeights: {
      magicSkeleton: 10,
      warriorSkeleton: 10,
      abyssLord: 1,
      skyLord: 1,
      waterLord: 1,
      fireLord: 1,
    },
    rewards: [
      { things: { mithril: 2 }, chance: 0.1 },
      { things: { darkGold: 2 }, chance: 0.02 },
      { things: { darkDust: 2 }, chance: 0.05 },
      { things: { crystal: 5 }, chance: 0.03 },
      { things: { gem: 5 }, chance: 0.03 },
      { things: { gold: 5 }, chance: 0.03 },
    ],
  },
  7: {
    floor: 7,
    monsterWeights: {
      lordSkeleton: 10,
      queenSkeleton: 10,
      punchSkeleton: 10,
      blackMist: 1,
      whiteMist: 1,
    },
    rewards: [
      { things: { darkGold: 2 }, chance: 0.02 },
      { things: { darkDust: 2 }, chance: 0.05 },
      { things: { crystal: 5 }, chance: 0.03 },
      { things: { gem: 5 }, chance: 0.03 },
      { things: { gold: 5 }, chance: 0.03 },
    ],
  },
  8: {
    floor: 8,
    monsterWeights: { fireDragon: 10, iceDragon: 10 },
    rewards: [
      { things: { darkGold: 2 }, chance: 0.02 },
      { things: { darkDust: 2 }, chance: 0.05 },
      { things: { crystal: 5 }, chance: 0.03 },
      { things: { gem: 5 }, chance: 0.03 },
      { things: { gold: 5 }, chance: 0.03 },
      { things: { reiPart: 5 }, chance: 0.01 },
    ],
  },
  9: {
    floor: 9,
    monsterWeights: { vampire: 10, vampireGirl: 10 },
    rewards: [
      { things: { gold: 50 }, chance: 0.02 },
      { things: { reiPart: 10 }, chance: 0.01 },
    ],
  },
  10: {
    floor: 10,
    monsterWeights: { superMan: 10, singleEye: 10, uang: 10 },
    rewards: [
      { things: { gold: 50 }, chance: 0.04 },
      { things: { reiPart: 10 }, chance: 0.01 },
    ],
  },
  11: {
    floor: 11,
    monsterWeights: { titan: 10, bomberman: 10, rainbowPeacock: 5 },
    rewards: [
      { things: { gold: 50 }, chance: 0.04 },
      { things: { reiPart: 10 }, chance: 0.01 },
    ],
  },
  12: {
    floor: 12,
    monsterWeights: { hundredGiant: 10, iceMustache: 10, seaDragon: 8 },
    rewards: [
      { things: { gold: 50 }, chance: 0.04 },
      { things: { reiPart: 10 }, chance: 0.01 },
    ],
  },
  13: {
    floor: 13,
    monsterWeights: { degeneratePaladin: 4, kiteHawk: 10, mandara: 8 },
    rewards: [],
  },
  14: {
    floor: 14,
    monsterWeights: { chimera: 4, fuseGiant: 5, hellGladiator: 4 },
    rewards: [],
  },
  15: {
    floor: 15,
    monsterWeights: { chaos: 4, vanity: 4, nightmare: 4 },
    rewards: [],
  },
  16: {
    floor: 16,
    monsterWeights: { ethereal: 4, guard: 4, stardustFish: 4 },
    rewards: [],
  },
}
