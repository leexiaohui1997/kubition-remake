import { useState } from 'react'
import { StatusBar } from '@/components/StatusBar'
import { SceneRouter } from '@/components/scenes/SceneRouter'
import { LogPanel } from '@/components/LogPanel'
import { Inventory, InventoryExtra } from '@/components/Inventory'
import { Modal } from '@/components/Modal'

function App() {
  const [showInventory, setShowInventory] = useState(false)

  return (
    <div className="min-h-screen bg-mud-bg font-mono px-4 md:px-0">
      <div className="max-w-4xl mx-auto py-4 space-y-4">
        {/* 游戏标题 */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-mud-accent tracking-wider">
            超苦逼冒险者
          </h1>
          <p className="text-mud-text-dim text-xs md:text-sm mt-1">MUD风格放置RPG - 复刻版</p>
        </div>

        {/* 状态栏 */}
        <StatusBar />

        {/* 快捷操作栏 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInventory(prev => !prev)}
            className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer
              ${
                showInventory
                  ? 'bg-mud-bg-tertiary border-mud-accent text-mud-accent'
                  : 'bg-mud-bg-secondary border-mud-bg-tertiary text-mud-text-dim hover:text-mud-info'
              }`}
          >
            [I] 背包
          </button>
        </div>

        {/* 主内容区：PC 端左右分栏，移动端上下堆叠 */}
        <div className="flex flex-col md:flex-row md:gap-4 gap-4">
          {/* 场景区 - PC 端占 2/3 */}
          <div className="w-full md:w-2/3">
            <SceneRouter />
          </div>
          {/* 侧边栏 - PC 端占 1/3，始终显示日志 */}
          <div className="w-full md:w-1/3">
            <LogPanel />
          </div>
        </div>
      </div>

      {/* 背包弹层 — 使用通用 Modal 组件 */}
      <Modal
        open={showInventory}
        onClose={() => setShowInventory(false)}
        title="背包"
        extra={<InventoryExtra />}
      >
        <Inventory />
      </Modal>
    </div>
  )
}

export default App
