"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, ExternalLink, ChevronLeft, ChevronRight, Blocks, Clock, Users, HardDrive } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface BlockTransaction {
  txid: string
  fee: string
  size: number
  inputCount: number
  outputCount: number
  amount: string
}

interface BlockDetail {
  height: number
  hash: string
  previousBlockHash: string
  nextBlockHash: string | null
  merkleRoot: string
  timestamp: string
  difficulty: string
  nonce: number
  version: number
  size: number
  weight: number
  transactionCount: number
  totalFees: string
  blockReward: string
  miner: string
  confirmations: number
  transactions: BlockTransaction[]
}

// Mock data generator for block details
const generateBlockDetail = (identifier: string): BlockDetail => {
  const isHeight = /^\d+$/.test(identifier)
  const height = isHeight ? Number.parseInt(identifier) : 800000 + Math.floor(Math.random() * 1000)
  const transactionCount = Math.floor(Math.random() * 3000) + 1000

  const transactions: BlockTransaction[] = Array.from({ length: Math.min(transactionCount, 50) }, () => ({
    txid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    fee: (Math.random() * 0.01).toFixed(8),
    size: Math.floor(Math.random() * 500) + 200,
    inputCount: Math.floor(Math.random() * 5) + 1,
    outputCount: Math.floor(Math.random() * 5) + 1,
    amount: (Math.random() * 10 + 0.1).toFixed(8),
  }))

  const totalFees = transactions.reduce((sum, tx) => sum + Number.parseFloat(tx.fee), 0).toFixed(8)

  return {
    height,
    hash: isHeight
      ? Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      : identifier,
    previousBlockHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    nextBlockHash:
      height < 850000
        ? Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        : null,
    merkleRoot: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    difficulty: (Math.random() * 10 + 50).toFixed(2) + "T",
    nonce: Math.floor(Math.random() * 4294967295),
    version: Math.floor(Math.random() * 4) + 1,
    size: Math.floor(Math.random() * 2000000) + 500000,
    weight: Math.floor(Math.random() * 4000000) + 1000000,
    transactionCount,
    totalFees,
    blockReward: "6.25",
    miner: ["Antpool", "F2Pool", "Foundry USA", "ViaBTC", "Binance Pool"][Math.floor(Math.random() * 5)],
    confirmations: Math.floor(Math.random() * 100) + 1,
    transactions,
  }
}

export default function BlockPage() {
  const params = useParams()
  const router = useRouter()
  const identifier = params.identifier as string
  const [block, setBlock] = useState<BlockDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchBlock = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setBlock(generateBlockDetail(identifier))
      setLoading(false)
    }

    fetchBlock()
  }, [identifier])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const navigateToBlock = (height: number) => {
    router.push(`/block/${height}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading block details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!block) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Block Not Found</h1>
            <p className="text-muted-foreground">The block you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToBlock(block.height - 1)}
                disabled={block.height <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToBlock(block.height + 1)}
                disabled={!block.nextBlockHash}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Blocks className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Block #{block.height.toLocaleString()}</h1>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-muted px-2 py-1 rounded break-all">{block.hash}</code>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(block.hash)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmations</CardTitle>
              <Badge variant="default">{block.confirmations}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{block.confirmations}</div>
              <p className="text-xs text-muted-foreground">Network confirmations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{block.transactionCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Block Size</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(block.size / 1000000).toFixed(2)} MB</div>
              <p className="text-xs text-muted-foreground">Weight: {(block.weight / 1000000).toFixed(2)} MWU</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timestamp</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {formatDistanceToNow(new Date(block.timestamp), { addSuffix: true })}
              </div>
              <p className="text-xs text-muted-foreground">{new Date(block.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Block Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-medium">{block.height.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Miner</span>
                    <Badge variant="outline">{block.miner}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-medium">{block.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Block Reward</span>
                    <span className="font-medium">{block.blockReward} BTC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Fees</span>
                    <span className="font-medium">{block.totalFees} BTC</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Block Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Previous Block</label>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-mono text-xs bg-transparent"
                      onClick={() => navigateToBlock(block.height - 1)}
                      disabled={block.height <= 1}
                    >
                      {block.previousBlockHash.substring(0, 16)}...
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                  {block.nextBlockHash && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Next Block</label>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-mono text-xs bg-transparent"
                        onClick={() => navigateToBlock(block.height + 1)}
                      >
                        {block.nextBlockHash.substring(0, 16)}...
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Block Transactions</CardTitle>
                <CardDescription>
                  Showing {Math.min(block.transactions.length, 50)} of {block.transactionCount.toLocaleString()}{" "}
                  transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {block.transactions.map((tx, index) => (
                    <div
                      key={tx.txid}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/tx/${tx.txid}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-mono text-sm font-medium hover:text-primary">
                            {tx.txid.substring(0, 16)}...
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tx.inputCount} inputs, {tx.outputCount} outputs • {tx.size} bytes
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tx.amount} BTC</div>
                        <div className="text-xs text-muted-foreground">Fee: {tx.fee} BTC</div>
                      </div>
                    </div>
                  ))}
                  {block.transactionCount > 50 && (
                    <div className="text-center py-4 text-muted-foreground">
                      ... and {(block.transactionCount - 50).toLocaleString()} more transactions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
                <CardDescription>Low-level block information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Block Hash</label>
                    <div className="font-mono text-sm bg-muted p-2 rounded break-all flex items-center justify-between">
                      {block.hash}
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(block.hash)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Merkle Root</label>
                    <div className="font-mono text-sm bg-muted p-2 rounded break-all flex items-center justify-between">
                      {block.merkleRoot}
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(block.merkleRoot)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Nonce</label>
                    <div className="text-sm bg-muted p-2 rounded">{block.nonce.toLocaleString()}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Version</label>
                    <div className="text-sm bg-muted p-2 rounded">{block.version}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Size</label>
                    <div className="text-sm bg-muted p-2 rounded">{block.size.toLocaleString()} bytes</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Weight</label>
                    <div className="text-sm bg-muted p-2 rounded">{block.weight.toLocaleString()} WU</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
