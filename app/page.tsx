"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HookCard } from "@/components/HookCard"
import { VoiceScript } from "@/components/VoiceScript"
import { PlatformReady } from "@/components/PlatformReady"
import { CreatorStyleResult } from "@/components/CreatorStyleResult"
// import { ExportSection } from "@/components/ExportSection"
import { HistoryDrawer } from "@/components/HistoryDrawer"
import { processScript } from "./actions/genie"
import { CreatorType } from "@/lib/creator-examples"
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'

interface HookResponse {
  hooks: string[]
  polishedScript?: string
  platformContent?: {
    formatted: string
    hashtags: string[]
  }
  creatorStyle?: {
    hook: string
    body: string
    creator: CreatorType
  }
}

type ToneType = "Casual" | "Hype" | "Educational" | "Sarcastic"
type PlatformType = "YouTube Shorts" | "TikTok" | "Instagram Reels"
type GoalType = "Go Viral" | "Sell Something" | "Educate" | "Entertain"

export default function Home() {
  const [script, setScript] = useState("")
  const [selectedTone, setSelectedTone] = useState<ToneType>("Casual")
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("YouTube Shorts")
  const [selectedGoal, setSelectedGoal] = useState<GoalType>("Go Viral")
  const [selectedCreator, setSelectedCreator] = useState<CreatorType>("None (Default)")
  const [result, setResult] = useState<HookResponse | null>(null)
  const [isPending, startTransition] = useTransition()
  const [apiUsage, setApiUsage] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Success sound effect
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcCz2V3/DBiC0HKn7H8Nuq')
    audioRef.current.volume = 0.3
  }, [])

  const playSuccessSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Ignore autoplay restrictions
      })
    }
  }

  // Track API usage
  useEffect(() => {
    const updateApiUsage = () => {
      const today = new Date().toDateString()
      const storageKey = 'hookgenie-generations'
      const stored = localStorage.getItem(storageKey)
      
      try {
        const data = stored ? JSON.parse(stored) : { date: today, count: 0 }
        setApiUsage(data.date === today ? data.count : 0)
      } catch {
        setApiUsage(0)
      }
    }
    
    updateApiUsage()
    const interval = setInterval(updateApiUsage, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleGenieIt = () => {
    if (!script.trim()) {
      toast.error('Please enter a script first! 📝')
      return
    }
    
    startTransition(async () => {
      try {
        const response = await processScript(script, selectedTone, selectedPlatform, selectedGoal, selectedCreator)
        
        // Check if it's an error response
        if (response.hooks[0]?.includes('🚨') || response.hooks[0]?.includes('Free tier')) {
          toast.error('Free tier limit reached! Upgrade for unlimited access 🚀')
        } else {
          setResult(response)
          playSuccessSound()
          toast.success('Magic hooks generated! ✨', {
            style: {
              borderRadius: '12px',
              background: '#f3e8ff',
              color: '#6b46c1',
            },
          })
          
          // Update local generation count on successful generation
          const today = new Date().toDateString()
          const storageKey = 'hookgenie-generations'
          const stored = localStorage.getItem(storageKey)
          
          try {
            const data = stored ? JSON.parse(stored) : { date: today, count: 0 }
            
            // Reset count if it's a new day
            if (data.date !== today) {
              data.date = today
              data.count = 0
            }
            
            // Increment count
            data.count++
            localStorage.setItem(storageKey, JSON.stringify(data))
            setApiUsage(data.count)
          } catch {
            // If localStorage fails, just increment the display counter
            setApiUsage(prev => prev + 1)
          }
        }
        
        // Save to history
        if (response.hooks && response.polishedScript) {
          const historyItem = {
            script,
            hooks: response.hooks,
            goal: selectedGoal,
            platform: selectedPlatform
          }
          // Use global function to save to history
          if ((window as any).saveToHookGenieHistory) {
            (window as any).saveToHookGenieHistory(historyItem)
          }
        }
        
        // Scroll to hooks section after generation
        setTimeout(() => {
          const hooksSection = document.getElementById('hooks-section')
          if (hooksSection) {
            hooksSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          }
        }, 100)
      } catch (error) {
        toast.error('Something went wrong! Please try again 🔮')
      }
    })
  }

  const handleLoadHistory = (historyItem: any) => {
    setScript(historyItem.script)
    setSelectedGoal(historyItem.goal)
    setSelectedPlatform(historyItem.platform)
    setResult({
      hooks: historyItem.hooks,
      polishedScript: "Previous script loaded from history. Click ✨ Genie It to regenerate.",
      platformContent: {
        formatted: "Load from history and regenerate to see platform content.",
        hashtags: ["#reload", "#regenerate"]
      }
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-hidden max-w-full">
      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fafafa',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
          },
        }}
      />
      
      {/* Floating Genie Lamp */}
      <div className="fixed top-8 right-8 z-50 float">
        <div className="w-16 h-16 opacity-30 hover:opacity-60 transition-opacity duration-300">
          <Image
            src="/genie-lamp.svg"
            alt="Genie Lamp"
            width={64}
            height={64}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* History Drawer */}
      <HistoryDrawer onLoadHistory={handleLoadHistory} />
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.1)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.15)_1px,transparent_0)]" />
      
      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/20 dark:bg-purple-400/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-100/30 dark:bg-purple-600/5 rounded-full blur-lg" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-20 max-w-full">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 overflow-hidden">
          {/* Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              HookGenie
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 font-medium px-4">
              Paste your script. Genie does the rest.
            </p>
          </div>

          {/* Main Interface */}
          <div className="space-y-6 md:space-y-8">
            {/* Input Textarea */}
            <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="relative">
                <Textarea
                  placeholder="Paste your script here..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  maxLength={5000}
                  className="min-h-[200px] md:min-h-[320px] text-base md:text-lg border-none bg-transparent resize-none focus:ring-0 focus-visible:ring-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 font-medium overflow-y-auto max-w-full word-wrap break-words"
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                  {script.length}/5000
                </div>
              </div>
            </div>

            {/* Goal Selector */}
            <div className="glass rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Goal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  What's your content goal?
                </p>
                <ToggleGroup
                  type="single"
                  value={selectedGoal}
                  onValueChange={(value: string) => value && setSelectedGoal(value as GoalType)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full"
                >
                  <ToggleGroupItem 
                    value="Go Viral" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 dark:hover:bg-orange-900/30 dark:hover:text-orange-300 dark:hover:border-orange-600 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-800 data-[state=on]:border-orange-400 dark:data-[state=on]:bg-orange-900/50 dark:data-[state=on]:text-orange-200 dark:data-[state=on]:border-orange-500 transition-all duration-300 font-medium"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🔥</span>
                      <span>Go Viral</span>
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Sell Something" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-900/30 dark:hover:text-green-300 dark:hover:border-green-600 data-[state=on]:bg-green-100 data-[state=on]:text-green-800 data-[state=on]:border-green-400 dark:data-[state=on]:bg-green-900/50 dark:data-[state=on]:text-green-200 dark:data-[state=on]:border-green-500 transition-all duration-300 font-medium"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">💰</span>
                      <span>Sell Something</span>
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Educate" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 dark:hover:border-blue-600 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 data-[state=on]:border-blue-400 dark:data-[state=on]:bg-blue-900/50 dark:data-[state=on]:text-blue-200 dark:data-[state=on]:border-blue-500 transition-all duration-300 font-medium"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">📚</span>
                      <span>Educate</span>
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Entertain" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-300 dark:hover:bg-pink-900/30 dark:hover:text-pink-300 dark:hover:border-pink-600 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-800 data-[state=on]:border-pink-400 dark:data-[state=on]:bg-pink-900/50 dark:data-[state=on]:text-pink-200 dark:data-[state=on]:border-pink-500 transition-all duration-300 font-medium"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🎭</span>
                      <span>Entertain</span>
                    </div>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Platform Selector */}
            <div className="glass rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  Optimize for Platform
                </h3>
                <Select value={selectedPlatform} onValueChange={(value: string) => setSelectedPlatform(value as PlatformType)}>
                  <SelectTrigger className="bg-white/90 dark:bg-gray-800/90 border-purple-200 dark:border-purple-700 text-gray-800 dark:text-gray-200 font-medium">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-800/95 border-purple-200 dark:border-purple-700">
                    <SelectItem value="YouTube Shorts" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-600 rounded-sm flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <span>YouTube Shorts</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TikTok" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-black dark:bg-white rounded-sm flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white dark:fill-black">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        </div>
                        <span>TikTok</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Instagram Reels" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-400 rounded-lg flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <path d="m16 11-4 4-4-4" fill="none" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <span>Instagram Reels</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Voice Polish Feature */}
            <div className="glass rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="text-xl">🎙️</span>
                  Voice Polish
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose a tone for your voice-friendly script:
                </p>
                <ToggleGroup
                  type="single"
                  value={selectedTone}
                  onValueChange={(value: string) => value && setSelectedTone(value as ToneType)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full"
                >
                  <ToggleGroupItem 
                    value="Casual" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 dark:hover:border-purple-600 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-400 dark:data-[state=on]:bg-purple-900/50 dark:data-[state=on]:text-purple-200 dark:data-[state=on]:border-purple-500 transition-all duration-300 font-medium"
                  >
                    Casual
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Hype" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 dark:hover:border-purple-600 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-400 dark:data-[state=on]:bg-purple-900/50 dark:data-[state=on]:text-purple-200 dark:data-[state=on]:border-purple-500 transition-all duration-300 font-medium"
                  >
                    Hype
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Educational" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 dark:hover:border-purple-600 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-400 dark:data-[state=on]:bg-purple-900/50 dark:data-[state=on]:text-purple-200 dark:data-[state=on]:border-purple-500 transition-all duration-300 font-medium"
                  >
                    Educational
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Sarcastic" 
                    className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 dark:hover:border-purple-600 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-400 dark:data-[state=on]:bg-purple-900/50 dark:data-[state=on]:text-purple-200 dark:data-[state=on]:border-purple-500 transition-all duration-300 font-medium"
                  >
                    Sarcastic
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Creator Style Selector */}
            <div className="glass rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="text-xl">✍️</span>
                  Write like:
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clone the exact style of top creators:
                </p>
                <Select value={selectedCreator} onValueChange={(value: string) => setSelectedCreator(value as CreatorType)}>
                  <SelectTrigger className="bg-white/90 dark:bg-gray-800/90 border-purple-200 dark:border-purple-700 text-gray-800 dark:text-gray-200 font-medium">
                    <SelectValue placeholder="Select creator style" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-800/95 border-purple-200 dark:border-purple-700">
                    <SelectItem value="None (Default)" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-400 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white">✨</span>
                        </div>
                        <span>None (Default)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="MrBeast" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-600 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white font-bold">M</span>
                        </div>
                        <span>MrBeast</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Alex Hormozi" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-600 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white font-bold">A</span>
                        </div>
                        <span>Alex Hormozi</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="GaryVee" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-600 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white font-bold">G</span>
                        </div>
                        <span>GaryVee</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Ali Abdaal" className="text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white font-bold">A</span>
                        </div>
                        <span>Ali Abdaal</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Genie Button */}
            <div className="space-y-4">
              {/* API Usage Indicator */}
              <div className="flex justify-center">
                <div className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${
                  apiUsage >= 45 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                    : apiUsage >= 35
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                }`}>
                  Generations: {apiUsage}/50 today
                </div>
              </div>
              
              <Button
                onClick={handleGenieIt}
                disabled={!script.trim() || isPending}
                size="lg"
                className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 text-white font-semibold text-base md:text-lg px-8 md:px-10 py-4 md:py-6 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] min-h-[56px] w-full md:w-auto"
              >
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <span className="animate-pulse">Genie is conjuring magic...</span>
                  </div>
                ) : (
                  "✨ Genie It"
                )}
              </Button>
            </div>
          </div>

          {/* Viral Hooks Display */}
          {result && result.hooks && !result.creatorStyle && (
            <div id="hooks-section" className="space-y-6 animate-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-2">
                <span className="text-3xl">✨</span>
                Your Viral Hooks
              </h3>
              
              {/* Rate Limit Warning */}
              {(result.hooks[0]?.includes('Rate limit') || result.hooks[0]?.includes('Free tier')) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 text-center">
                  <div className="text-yellow-800 dark:text-yellow-200 font-medium">
                    ⚠️ Free Tier Limit Information
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    You've reached your daily generation limit. Upgrade to premium for unlimited access.
                  </div>
                  <div className="mt-3">
                    <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 underline text-sm">
                      Learn about premium plans →
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 max-w-3xl mx-auto">
                {result.hooks.map((hook, index) => (
                  <HookCard key={index} hook={hook} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Creator Style Result Display */}
          {result && result.creatorStyle && (
            <div id="hooks-section" className="space-y-6 animate-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-2">
                <span className="text-3xl">✍️</span>
                Creator Style Magic
              </h3>
              
              <CreatorStyleResult 
                hook={result.creatorStyle.hook}
                body={result.creatorStyle.body}
                creator={result.creatorStyle.creator}
              />
            </div>
          )}

          {/* Voice Script Display */}
          {result && result.polishedScript && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent dark:via-purple-700"></div>
              <VoiceScript script={result.polishedScript} />
            </div>
          )}

          {/* Platform Ready Display */}
          {result && result.polishedScript && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-700"></div>
              <PlatformReady originalScript={result.polishedScript} platform={selectedPlatform} goal={selectedGoal} />
            </div>
          )}

          {/* Export Section - Temporarily disabled */}
          {/* {result && result.hooks && result.polishedScript && result.platformContent && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent dark:via-indigo-700"></div>
              Export section will be here
            </div>
          )} */}
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="relative z-10 border-t border-purple-100 dark:border-purple-900/30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-gray-600 dark:text-gray-400">
            <span className="font-medium text-purple-600 dark:text-purple-400">HookGenie</span>
            <span className="hidden md:inline">—</span>
            <span className="text-sm md:text-base">Your 12-Second Script Genie</span>
            <span className="hidden md:inline">•</span>
            <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm md:text-base transition-colors duration-200 cursor-pointer">
              $19/mo. Cancel anytime.
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
