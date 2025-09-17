"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { CreatorType } from "@/lib/creator-examples"

interface CreatorStyleResultProps {
  hook: string
  body: string
  creator: CreatorType
}

export function CreatorStyleResult({ hook, body, creator }: CreatorStyleResultProps) {
  const [copiedHook, setCopiedHook] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)

  const handleCopyHook = async () => {
    try {
      await navigator.clipboard.writeText(hook)
      setCopiedHook(true)
      setTimeout(() => setCopiedHook(false), 2000)
    } catch (err) {
      console.error("Failed to copy hook: ", err)
    }
  }

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(body)
      setCopiedBody(true)
      setTimeout(() => setCopiedBody(false), 2000)
    } catch (err) {
      console.error("Failed to copy body: ", err)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Creator Style Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700">
          <span className="text-lg">✍️</span>
          Style: {creator}
        </div>
      </div>

      {/* Hook Section */}
      <div className="bg-gradient-to-br from-purple-50/80 to-indigo-100/80 dark:from-purple-950/80 dark:to-indigo-900/80 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Hook (in {creator} style)
          </h3>
          <Button
            onClick={handleCopyHook}
            variant="outline"
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 border-purple-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-600 dark:hover:border-purple-500 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            {copiedHook ? (
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
        
        <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-4 border border-purple-200/30 dark:border-purple-700/30">
          <p className="font-inter text-lg font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
            {hook}
          </p>
        </div>
      </div>

      {/* Script Body Section */}
      <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-2xl">📜</span>
            Script Body
          </h3>
          <Button
            onClick={handleCopyBody}
            variant="outline"
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-900/30 dark:hover:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            {copiedBody ? (
              <>
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="ml-1 text-green-600 dark:text-green-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="ml-1 text-gray-600 dark:text-gray-400 font-medium">Copy</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30 overflow-hidden">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-900 dark:text-gray-100 break-words overflow-wrap-anywhere max-w-full">
            {body}
          </pre>
        </div>
      </div>
    </div>
  )
}