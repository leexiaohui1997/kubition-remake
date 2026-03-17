import { StatusBar } from '@/components/StatusBar'
import { TownScene } from '@/components/TownScene'
import { LogPanel } from '@/components/LogPanel'

function App() {
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

        {/* 主内容区：PC 端左右分栏，移动端上下堆叠 */}
        <div className="flex flex-col md:flex-row md:gap-4 gap-4">
          {/* 场景区 - PC 端占 2/3 */}
          <div className="w-full md:w-2/3">
            <TownScene />
          </div>
          {/* 日志面板 - PC 端占 1/3 */}
          <div className="w-full md:w-1/3">
            <LogPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
