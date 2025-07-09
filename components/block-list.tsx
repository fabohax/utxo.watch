"use client"
import { Blocks, Clock, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface Block {
  height: number
  hash: string
  transactions: number
  size: string
  timestamp: string
  miner: string
}

interface BlockListProps {
  blocks: Block[]
  detailed?: boolean
}

export function BlockList({ blocks, detailed = false }: BlockListProps) {
  const router = useRouter()

  return (
    <div className="space-y-3">
      {blocks.map((block) => (
        <div
          key={block.height}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => router.push(`/block/${block.height}`)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Blocks className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium hover:text-primary">Block #{block.height.toLocaleString()}</div>
              {detailed && (
                <div className="font-mono text-xs text-muted-foreground">{block.hash.substring(0, 16)}...</div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(block.timestamp), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium">{block.transactions.toLocaleString()} txs</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {block.size} MB • {block.miner}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
