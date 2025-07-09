"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { toast } from "sonner"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)

    try {
      // Detect if it's a transaction ID (64 hex characters), address, or block
      const trimmedQuery = query.trim()

      if (trimmedQuery.length === 64 && /^[a-fA-F0-9]+$/.test(trimmedQuery)) {
        // Could be transaction ID or block hash
        // For simplicity, we'll assume it's a transaction first, but in real implementation
        // you'd check both
        router.push(`/tx/${trimmedQuery}`)
      } else if (/^\d+$/.test(trimmedQuery)) {
        // Block height (numeric)
        router.push(`/block/${trimmedQuery}`)
      } else if (
        (trimmedQuery.startsWith("1") || trimmedQuery.startsWith("3") || trimmedQuery.startsWith("bc1")) &&
        trimmedQuery.length >= 26 &&
        trimmedQuery.length <= 62
      ) {
        // Bitcoin address
        router.push(`/address/${trimmedQuery}`)
      } else {
        toast.error("Invalid transaction ID, Bitcoin address, or block height/hash format")
      }
    } catch (error) {
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        type="text"
        placeholder="Search by transaction ID, address, or block..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={isSearching}>
        <Search className="w-4 h-4" />
      </Button>
    </form>
  )
}
