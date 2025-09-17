"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, FileText, Mic, Hash, Download, Sparkles } from "lucide-react"

interface ExportSectionProps {
  hooks: string[]
  polishedScript: string
  hashtags: string[]
  platform: string
}

export function ExportSection({ hooks, polishedScript, hashtags, platform }: ExportSectionProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleCopy = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(type)
      setShowConfetti(true)
      
      setTimeout(() => {
        setCopied(null)
        setShowConfetti(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy content: ", err)
    }
  }

  const formatCaptionForSocial = () => {
    const formattedScript = polishedScript
      .split('. ')
      .map((sentence, index) => {
        const emojis = ['🔥', '✨', '💫', '🎯', '⚡', '🚀', '💥', '🌟']
        const emoji = emojis[index % emojis.length]
        return `${emoji} ${sentence.trim()}`
      })
      .join('\\n\\n')
    
    return `${formattedScript}\\n\\n${hashtags.join(' ')}`
  }

  const formatTeleprompterScript = () => {
    return polishedScript
      .replace(/\\. /g, '.\\n\\n')
      .toUpperCase()
  }

  const formatCopyAll = () => {
    const hooksText = hooks.map((hook, i) => `${i + 1}. ${hook}`).join('\\n')
    return `🎯 VIRAL HOOKS:\n${hooksText}\n\n🎤 VOICE SCRIPT:\n${polishedScript}\n\n📱 HASHTAGS:\n${hashtags.join(' ')}`
  }

  const openTeleprompter = () => {
    const teleprompterContent = formatTeleprompterScript()
    const newWindow = window.open('', '_blank', 'width=800,height=600')
    if (newWindow) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Teleprompter Mode - HookGenie</title>
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 2.5rem;
                line-height: 1.8;
                padding: 2rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                text-align: center;
                overflow-y: auto;
                animation: scroll 30s linear infinite;
              }
              @keyframes scroll {
                0% { transform: translateY(100vh); }
                100% { transform: translateY(-100%); }
              }
              .pause-scroll { animation-play-state: paused; }
              .control-bar {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
              }
              button {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 1rem;
              }
              button:hover {
                background: rgba(255,255,255,0.3);
              }
            </style>
          </head>
          <body onclick="document.body.classList.toggle('pause-scroll')">
            <div class="control-bar">
              <button onclick="location.reload()">🔄 Restart</button>
              <button onclick="window.close()">✕ Close</button>
            </div>
            <div style="white-space: pre-line;">
              ${teleprompterContent}
            </div>
            <script>
              document.addEventListener('keydown', function(e) {
                if (e.code === 'Space') {
                  e.preventDefault();
                  document.body.classList.toggle('pause-scroll');
                }
              });
            </script>
          </body>
        </html>
      `
      newWindow.document.write(htmlContent)
      newWindow.document.close()
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 to-purple-100/80 dark:from-indigo-950/80 dark:to-purple-900/80 rounded-3xl p-6 border border-indigo-200/50 dark:border-indigo-700/50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s'
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📤</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Export Your Content
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Caption Format */}
          <Button
            onClick={() => handleCopy(formatCaptionForSocial(), 'caption')}
            variant="outline"
            className="h-auto p-4 bg-white/90 dark:bg-gray-800/90 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-500 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/70 transition-colors">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  📱 Caption Format
                  {copied === 'caption' && <Check className="h-4 w-4 text-green-600" />}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Line breaks + emojis for social
                </div>
              </div>
            </div>
          </Button>

          {/* Teleprompter Mode */}
          <Button
            onClick={openTeleprompter}
            variant="outline"
            className="h-auto p-4 bg-white/90 dark:bg-gray-800/90 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-500 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/70 transition-colors">
                <Mic className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  🎤 Teleprompter Mode
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Large font, auto-scroll view
                </div>
              </div>
            </div>
          </Button>

          {/* Hashtags Only */}
          <Button
            onClick={() => handleCopy(hashtags.join(' '), 'hashtags')}
            variant="outline"
            className="h-auto p-4 bg-white/90 dark:bg-gray-800/90 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-500 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/70 transition-colors">
                <Hash className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  📊 Hashtags Only
                  {copied === 'hashtags' && <Check className="h-4 w-4 text-green-600" />}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {hashtags.length} {platform} hashtags
                </div>
              </div>
            </div>
          </Button>

          {/* Copy All */}
          <Button
            onClick={() => handleCopy(formatCopyAll(), 'all')}
            variant="outline"
            className="h-auto p-4 bg-white/90 dark:bg-gray-800/90 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-500 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/70 transition-colors">
                <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  📤 Copy All
                  {copied === 'all' && <Check className="h-4 w-4 text-green-600" />}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hooks + script + hashtags
                </div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}