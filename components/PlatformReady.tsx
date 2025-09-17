"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy, Check } from "lucide-react"
import { trimForDuration } from "@/app/actions/genie"

interface PlatformReadyProps {
  originalScript: string
  platform: string
  goal: string
}

type DurationType = "7s" | "15s" | "30s" | "60s"

export function PlatformReady({ originalScript, platform, goal }: PlatformReadyProps) {
  const [selectedDuration, setSelectedDuration] = useState<DurationType>("30s")
  const [trimmedContent, setTrimmedContent] = useState<{ formatted: string; hashtags: string[] } | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleTrim = () => {
    startTransition(async () => {
      const result = await trimForDuration(originalScript, selectedDuration, platform as any, goal as any)
      setTrimmedContent(result)
    })
  }

  const handleCopy = async () => {
    if (!trimmedContent) return
    try {
      const fullContent = `${trimmedContent.formatted}\n\n${trimmedContent.hashtags.join(" ")}`
      await navigator.clipboard.writeText(fullContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleHashtagCopy = async (hashtag: string) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtag(hashtag)
      setTimeout(() => setCopiedHashtag(null), 2000)
    } catch (err) {
      console.error("Failed to copy hashtag: ", err)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-100/80 dark:from-blue-950/80 dark:to-indigo-900/80 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📱</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Platform Ready
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Choose your video duration:
            </p>
            <RadioGroup
              value={selectedDuration}
              onValueChange={(value) => setSelectedDuration(value as DurationType)}
              className="flex flex-wrap gap-4"
            >
              {["7s", "15s", "30s", "60s"].map((duration) => (
                <div key={duration} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={duration} 
                    id={duration}
                    className="border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400"
                  />
                  <label 
                    htmlFor={duration} 
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    {duration}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={handleTrim}
            disabled={isPending}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-xl transition-all duration-200"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Optimizing...
              </>
            ) : (
              `📱 Optimize for ${selectedDuration}`
            )}
          </Button>
        </div>

        {trimmedContent && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-4 border border-blue-200/30 dark:border-blue-700/30">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedDuration} Optimized Content
                </h4>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="bg-white/80 dark:bg-gray-800/80 border-blue-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="ml-1 text-green-600 dark:text-green-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">Copy All</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-3 overflow-hidden">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-gray-100 break-words overflow-wrap-anywhere max-w-full">
                    {trimmedContent.formatted}
                  </pre>
                </div>
                
                <div className="border-t border-blue-200/50 dark:border-blue-700/50 pt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Trending Hashtags (click to copy):</p>
                  <div className="flex flex-wrap gap-2">
                    {trimmedContent.hashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        onClick={() => handleHashtagCopy(hashtag)}
                        className="group relative bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-all duration-200 cursor-pointer border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm"
                      >
                        <span className="flex items-center gap-1">
                          {hashtag}
                          {copiedHashtag === hashtag ? (
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          )}
                        </span>
                        {copiedHashtag === hashtag && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                            Copied!
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}