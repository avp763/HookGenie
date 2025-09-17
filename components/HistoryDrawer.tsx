"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { History, Clock, Trash2, FileText } from "lucide-react"

interface HistoryItem {
  id: string
  timestamp: Date
  script: string
  hooks: string[]
  goal: string
  platform: string
}

interface HistoryDrawerProps {
  onLoadHistory: (item: HistoryItem) => void
}

export function HistoryDrawer({ onLoadHistory }: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('hookgenie-history')
      if (saved) {
        const parsed = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setHistory(parsed.slice(0, 3)) // Keep only last 3
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    try {
      const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: new Date()
      }
      
      const currentHistory = [...history]
      currentHistory.unshift(newItem)
      const updatedHistory = currentHistory.slice(0, 3) // Keep only last 3
      
      setHistory(updatedHistory)
      localStorage.setItem('hookgenie-history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Failed to save to history:', error)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('hookgenie-history')
  }

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('hookgenie-history', JSON.stringify(updatedHistory))
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  // Expose saveToHistory method globally
  useEffect(() => {
    (window as any).saveToHookGenieHistory = saveToHistory
  }, [])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 bg-white/95 dark:bg-gray-800/95 border-purple-200 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 shadow-lg text-gray-900 dark:text-gray-100 font-medium"
        >
          <History className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-900 dark:text-gray-100">History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-purple-200 dark:border-purple-700 overflow-y-auto sidebar-scroll max-h-screen">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Recent Scripts
          </SheetTitle>
          <SheetDescription className="text-gray-700 dark:text-gray-300">
            Your last 3 generated scripts are saved locally
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 overflow-y-auto sidebar-scroll max-h-[calc(100vh-120px)] pr-2">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-700 dark:text-gray-300">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-60 text-gray-600 dark:text-gray-400" />
              <p className="text-gray-900 dark:text-gray-100 font-medium">No saved scripts yet</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generate some content to see history here</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {history.length} saved script{history.length !== 1 ? 's' : ''}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200 rounded-full font-medium">
                        {item.goal}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                        {item.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 line-clamp-2 font-medium leading-relaxed break-words">
                    {item.script.substring(0, 120)}...
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">Generated hooks:</p>
                    <div className="space-y-1">
                      {item.hooks.slice(0, 2).map((hook, index) => (
                        <p key={index} className="text-xs text-purple-700 dark:text-purple-300 italic font-medium bg-purple-50/50 dark:bg-purple-900/20 px-2 py-1 rounded break-words">
                          "{hook}"
                        </p>
                      ))}
                      {item.hooks.length > 2 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">+{item.hooks.length - 2} more...</p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      onLoadHistory(item)
                      setIsOpen(false)
                    }}
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Load Script
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}