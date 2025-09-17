"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react"

interface VoiceScriptProps {
  script: string
}

export function VoiceScript({ script }: VoiceScriptProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎙️</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Voice-Friendly Script
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 border-purple-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-600 dark:hover:border-purple-500 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="ml-1 text-green-600 dark:text-green-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="ml-1 text-purple-600 dark:text-purple-400 font-medium">Copy All</span>
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded 
          ? 'max-h-96 opacity-100' 
          : 'max-h-32 opacity-90'
      }`}>
        <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 overflow-hidden">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-900 dark:text-gray-100 break-words overflow-wrap-anywhere max-w-full">
            {script}
          </pre>
        </div>
      </div>
      
      {!isExpanded && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
          >
            Click to expand full script
          </button>
        </div>
      )}
    </div>
  )
}