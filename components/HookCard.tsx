"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface HookCardProps {
  hook: string
  index: number
}

export function HookCard({ hook, index }: HookCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="glass rounded-3xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-purple-500/10 group overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-inter text-lg font-medium text-gray-900 dark:text-gray-100 leading-relaxed break-words overflow-wrap-anywhere">
            {hook}
          </p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="shrink-0 bg-white/80 dark:bg-gray-800/80 border-purple-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-600 dark:hover:border-purple-500 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="ml-1 text-green-600 dark:text-green-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="ml-1 text-purple-600 dark:text-purple-400 font-medium">Copy</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}