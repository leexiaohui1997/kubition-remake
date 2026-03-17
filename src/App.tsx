import { useEffect } from 'react'
import { DataLoader } from '@/utils/dataLoader'
import './App.css'

function App() {
  useEffect(() => {
    // 输出各数据集的条目数量
    console.log('📊 数据层统计:')
    console.log(`   物品: ${Object.keys(DataLoader.items).length} 个`)
    console.log(`   怪物: ${Object.keys(DataLoader.monsters).length} 个`)
    console.log(`   地点: ${Object.keys(DataLoader.places).length} 个`)
    console.log(`   配方: ${Object.keys(DataLoader.recipes).length} 个`)
    console.log(`   地牢: ${Object.keys(DataLoader.dungeons).length} 层`)
    // 执行数据交叉引用验证
    DataLoader.validate()
  }, [])

  return (
    <div className="min-h-screen bg-mud-bg font-mono flex items-center justify-center">
      <div className="mud-panel text-center max-w-lg w-full mx-4">
        {/* 游戏标题 */}
        <h1 className="text-3xl font-bold text-mud-accent mb-2 tracking-wider">
          超苦逼冒险者 - 复刻版
        </h1>
        {/* 副标题 */}
        <p className="text-mud-text-dim text-sm mb-6">MUD风格放置RPG</p>
        {/* 分隔线 */}
        <div className="border-t border-mud-text-dim my-4" />
        {/* 状态信息 */}
        <div className="mud-log text-left">
          <p className="text-mud-success">[系统] 项目初始化完成</p>
          <p className="text-mud-info">[信息] Vite + React + TypeScript + Tailwind CSS</p>
          <p className="text-mud-text-dim">[等待] 游戏系统加载中...</p>
        </div>
        {/* 示例按钮 */}
        <div className="mt-4">
          <button className="mud-btn">开始冒险</button>
        </div>
      </div>
    </div>
  )
}

export default App
