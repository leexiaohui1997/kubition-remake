import { getItem } from '@/data/items'
import { ItemName } from '@/components/ItemName'

interface LogMessageProps {
  message: string
}

export function LogMessage({ message }: LogMessageProps) {
  // 按 {xxx} 格式分割，保留分隔符本身
  const parts = message.split(/(\{[^}]+\})/g)

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\{([^}]+)\}$/)
        if (match) {
          const itemId = match[1]
          // 匹配到物品 key，用 ItemName 展示
          if (getItem(itemId)) {
            return <ItemName key={i} item={{ id: itemId }} truncate={false} />
          }
          // 未匹配到，原样输出 {xxx}
          return <span key={i}>{part}</span>
        }
        // 普通文本段
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
