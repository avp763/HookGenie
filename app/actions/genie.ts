"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { CreatorType, getCreatorExamplesPrompt } from "@/lib/creator-examples"

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
type DurationType = "7s" | "15s" | "30s" | "60s"

// Rate limiting helper
function shouldMakeAPICall(): boolean {
  if (typeof window === 'undefined') return true // Server-side, proceed
  
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
    
    // Check if under limit (leave buffer of 5 generations)
    if (data.count >= 45) {
      return false
    }
    
    // Increment and save
    data.count++
    localStorage.setItem(storageKey, JSON.stringify(data))
    return true
  } catch {
    return true // If localStorage fails, proceed
  }
}

function getAPICallCount(): number {
  if (typeof window === 'undefined') return 0
  
  const today = new Date().toDateString()
  const storageKey = 'hookgenie-generations'
  const stored = localStorage.getItem(storageKey)
  
  try {
    const data = stored ? JSON.parse(stored) : { date: today, count: 0 }
    return data.date === today ? data.count : 0
  } catch {
    return 0
  }
}

function getGoalInstructions(goal: GoalType): string {
  switch (goal) {
    case "Go Viral":
      return "Script goal: Go Viral. Adjust structure, hooks, and CTAs accordingly. Add comment bait, cliffhangers, shock value. Use curiosity gaps and controversial angles. Include 'wait for it' moments and opinion-splitting statements."
    case "Sell Something":
      return "Script goal: Sell Something. Adjust structure, hooks, and CTAs accordingly. Add urgency, social proof, scarcity. Include testimonials, before/after comparisons, and clear value propositions. Use sales psychology and FOMO tactics."
    case "Educate":
      return "Script goal: Educate. Adjust structure, hooks, and CTAs accordingly. Simplify complex concepts, use analogies and step-by-step breakdowns. Include 'here's why' explanations and practical takeaways."
    case "Entertain":
      return "Script goal: Entertain. Adjust structure, hooks, and CTAs accordingly. Add humor, memes, callbacks, and personality. Use storytelling, unexpected twists, and relatable situations for maximum engagement."
    default:
      return "Script goal: Go Viral. Adjust structure, hooks, and CTAs accordingly. Add comment bait, cliffhangers, shock value."
  }
}

function getPlatformTips(platform: PlatformType): { hookTips: string; voiceTips: string; contentTips: string } {
  switch (platform) {
    case "YouTube Shorts":
      return {
        hookTips: "Use question hooks, countdown formats, and 'Wait for it...' teasers. YouTube audience loves educational reveals and behind-the-scenes content.",
        voiceTips: "Speak clearly for YouTube's diverse age groups. Use educational tone. Include 'Subscribe if...' type calls-to-action naturally.",
        contentTips: "Hook in first 3 seconds with question or bold statement. Use quick cuts in mind. Include educational value. YouTube Shorts perform best at 15-60 seconds."
      }
    case "TikTok":
      return {
        hookTips: "Use trending sounds, POV formats, 'Tell me you're X without telling me', challenges, and storytime hooks. TikTok loves relatable, authentic content.",
        voiceTips: "Match trending audio patterns. Use Gen-Z language and current slang. Fast-paced delivery with personality and attitude.",
        contentTips: "Hook must work with music/sound. Quick transitions, trending dance moves or gestures. Vertical storytelling. 15-30 seconds optimal."
      }
    case "Instagram Reels":
      return {
        hookTips: "Use lifestyle angles, before/after reveals, aesthetic presentations, and aspirational content. Instagram audience values polished, inspiring content.",
        voiceTips: "Polished, aspirational tone. Focus on lifestyle benefits. Use Instagram-specific terms like 'link in bio' naturally.",
        contentTips: "Visually appealing from frame one. Lifestyle-focused angles. Instagram aesthetic important. 15-30 seconds with strong visual hooks."
      }
    default:
      return {
        hookTips: "optimized for platform trends and audience behavior",
        voiceTips: "adjust pacing and references for platform viewers",
        contentTips: "platform-optimized formatting with trending elements"
      }
  }
}

export async function processScript(
  script: string, 
  tone: ToneType = "Casual", 
  platform: PlatformType = "YouTube Shorts",
  goal: GoalType = "Go Viral",
  creator: CreatorType = "None (Default)"
): Promise<HookResponse> {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found, returning placeholder hooks")
      return {
        hooks: [
          "You won't believe what happened next...",
          "This changed everything in 30 seconds",
          "Why does nobody talk about this?"
        ],
        polishedScript: "Here's your script, but more conversational and easier to read aloud. Perfect for voice content!",
        platformContent: {
          formatted: "🎯 ATTENTION GRABBING opening for your script content here...",
          hashtags: ["#viral", "#trending", "#content", "#fyp", "#shorts"]
        }
      }
    }

    // Check rate limit before making API calls
    const apiCallCount = getAPICallCount()
    if (apiCallCount >= 45) {
      return {
        hooks: [
          "🚨 Daily limit approaching (" + apiCallCount + "/50)",
          "💡 Conserving generations for you",
          "⏰ Free tier resets at midnight"
        ],
        polishedScript: "⚠️ Approaching Daily Limit\n\nTo preserve your remaining generations (" + (50 - apiCallCount) + " left today), we're showing a preview. Your script is ready to use:\n\n" + script + "\n\nTip: Each generation uses multiple AI requests. Upgrade to premium for unlimited access.",
        platformContent: {
          formatted: "🚨 Generation Limit Conservation\n\n• " + (50 - apiCallCount) + " generations remaining today\n• Your script is preserved above\n• Free tier resets at midnight UTC",
          hashtags: ["#conservation", "#freetier", "#preserved", "#midnight", "#upgrade"]
        }
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const platformTips = getPlatformTips(platform)
    const goalInstructions = getGoalInstructions(goal)

    // Generate hooks
    const creatorStylePrompt = getCreatorExamplesPrompt(creator)
    let hooksPrompt: string
    
    if (creator === "None (Default)") {
      hooksPrompt = `You are HookGenie, a viral script assistant for short-form video. Generate 3 scroll-stopping hooks based on this draft: ${script}.

${goalInstructions}

Make them:
- Under 10 words
- Curiosity or shock-driven
- Platform-agnostic (for now)
- Include at least one with a cliffhanger or question
- ${platformTips.hookTips}

Return as JSON: { "hooks": ["hook1", "hook2", "hook3"] }`
    } else {
      hooksPrompt = `${creatorStylePrompt}

Now generate a new short-form video script for: "${script}"

ALSO apply:
- Tone: ${tone}
- Goal: ${goal}

Rules:
- Match sentence length, emotional pacing, delivery rhythm, and structural patterns from examples.
- Include hook + 15–60s body.
- Keep under 200 words.
- Return as JSON: { "hook": "string", "body": "string" }

${goalInstructions}`
    }

    // Generate voice-friendly script
    const voicePrompt = `Rewrite this script to sound natural when spoken aloud. Match tone: ${tone}. ${goalInstructions} Remove jargon. Shorten sentences. Add contractions. Make it feel like talking to a friend. ${platformTips.voiceTips} Return polished script as string.

Original script: ${script}`

    // Generate platform-ready content
    const platformPrompt = `Take this script and optimize it for ${platform}. ${goalInstructions} ${platformTips.contentTips}

Create attention-grabbing content with:
1. Strong opening (first 3 words must hook silent viewers)
2. Format for 30-second duration
3. Add 5 trending hashtags for ${platform}

Script: ${script}

Return as JSON: { "formatted": "formatted script with emoji bullets", "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"] }`

    // Make all three API calls
    const [hooksResult, voiceResult, platformResult] = await Promise.all([
      model.generateContent(hooksPrompt),
      model.generateContent(voicePrompt),
      model.generateContent(platformPrompt)
    ])

    const hooksResponse = await hooksResult.response
    const voiceResponse = await voiceResult.response
    const platformResponse = await platformResult.response
    const hooksText = hooksResponse.text()
    const voiceText = voiceResponse.text()
    const platformText = platformResponse.text()

    // Clean up voice script
    let polishedScript = voiceText.trim()

    // Try to parse JSON response for hooks
    let hooks: string[] = []
    let creatorStyleData: { hook: string; body: string; creator: CreatorType } | undefined
    
    try {
      if (creator === "None (Default)") {
        // Standard hook generation
        const jsonMatch = hooksText.match(/\{[^}]*"hooks"[^}]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.hooks && Array.isArray(parsed.hooks) && parsed.hooks.length >= 3) {
            hooks = parsed.hooks.slice(0, 3)
          }
        }
      } else {
        // Creator-style script generation
        const jsonMatch = hooksText.match(/\{[^}]*"hook"[^}]*"body"[^}]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.hook && parsed.body) {
            creatorStyleData = {
              hook: parsed.hook,
              body: parsed.body,
              creator: creator
            }
            hooks = [
              `🎯 ${creator} Style Hook Created`,
              "View your custom hook & script below",
              "Perfectly cloned writing style"
            ]
          }
        }
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError)
    }

    // Fallback: extract hooks from plain text response
    if (hooks.length === 0) {
      const lines = hooksText.split('\n').filter(line => line.trim().length > 0)
      hooks = lines
        .filter(line => line.length <= 60) // Reasonable hook length
        .slice(0, 3)
    }

    // Use fallback hooks if still empty
    if (hooks.length < 3) {
      hooks = [
        "This will blow your mind...",
        "Nobody expected this outcome",
        "What happens next is shocking"
      ]
    }

    // Parse platform content
    let platformContent = {
      formatted: "🎯 ATTENTION GRABBING opening for your content...",
      hashtags: ["#viral", "#trending", "#content", "#fyp", "#shorts"]
    }
    
    try {
      const platformJsonMatch = platformText.match(/\{[^}]*"formatted"[^}]*\}/)
      if (platformJsonMatch) {
        const parsed = JSON.parse(platformJsonMatch[0])
        if (parsed.formatted && parsed.hashtags) {
          platformContent = parsed
        }
      }
    } catch (parseError) {
      console.error("Failed to parse platform JSON:", parseError)
    }
    
    return {
      hooks,
      polishedScript,
      platformContent,
      creatorStyle: creatorStyleData
    }
  } catch (error: any) {
    console.error("Error generating hooks:", error)
    
    // Check if it's a rate limit error
    if (error?.status === 429) {
      return {
        hooks: [
          "🚨 Free tier limit reached - try again later",
          "💡 Upgrade for unlimited hook generation",
          "⏰ Daily limit resets at midnight"
        ],
        polishedScript: "⚠️ Free Tier Limit Reached\n\nYou've reached your daily limit for AI-powered content generation. Your script is preserved below for manual use.\n\nOptions:\n• Wait 24 hours for limit reset\n• Upgrade to premium for unlimited access\n• Use your original script as-is\n\nOriginal Script:\n" + script,
        platformContent: {
          formatted: "🚨 Daily Generation Limit Reached\n\n• Your original content is preserved above\n• Upgrade to premium for unlimited generations\n• Free tier resets daily at midnight UTC",
          hashtags: ["#freetier", "#upgrade", "#premium", "#unlimited", "#reset"]
        }
      }
    }
    
    // Check if it's an API key error
    if (error?.message?.includes('API key')) {
      return {
        hooks: [
          "🔑 Service configuration issue",
          "⚙️ Please contact support",
          "📝 Service temporarily unavailable"
        ],
        polishedScript: "🔑 Service Configuration Issue\n\nThere seems to be a temporary service issue. Please try again later or contact support if the problem persists.\n\nYour original script: " + script,
        platformContent: {
          formatted: "🔑 Service Unavailable\n\n• Temporary configuration issue\n• Please try again later\n• Contact support if problem persists",
          hashtags: ["#service", "#support", "#temporary", "#tryagain", "#help"]
        }
      }
    }
    
    // Generic fallback for other errors
    return {
      hooks: [
        "You won't believe what happened next...",
        "This changed everything in 30 seconds",
        "Why does nobody talk about this?"
      ],
      polishedScript: "Here's your script rewritten for better voice delivery. More natural, conversational, and easier to read aloud!",
      platformContent: {
        formatted: "🎯 ATTENTION GRABBING opening for your content...",
        hashtags: ["#viral", "#trending", "#content", "#fyp", "#shorts"]
      }
    }
  }
}

export async function trimForDuration(
  content: string, 
  duration: DurationType, 
  platform: PlatformType,
  goal: GoalType = "Go Viral"
): Promise<{ formatted: string; hashtags: string[] }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        formatted: "🎯 WATCH THIS: " + content.substring(0, 100) + "...",
        hashtags: ["#viral", "#trending", "#content", "#fyp", "#shorts"]
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const platformTips = getPlatformTips(platform)
    const goalInstructions = getGoalInstructions(goal)

    const prompt = `Trim this content to fit exactly ${duration} when spoken aloud for ${platform}. ${goalInstructions} ${platformTips.contentTips}

Format with:
1. First 3 words MUST grab attention for silent viewers
2. Use emoji bullet points (• 🎯 ✨ etc.)
3. Optimize pacing for ${duration} duration
4. Add 5 trending hashtags for ${platform}

Content: ${content}

Return as JSON: { "formatted": "formatted content with emoji bullets", "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"] }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      const jsonMatch = text.match(/\{[^}]*"formatted"[^}]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.formatted && parsed.hashtags) {
          return parsed
        }
      }
    } catch (parseError) {
      console.error("Failed to parse duration JSON:", parseError)
    }

    return {
      formatted: "🎯 WATCH THIS: " + content.substring(0, 150) + "...",
      hashtags: ["#viral", "#trending", "#" + platform.toLowerCase().replace(" ", ""), "#fyp", "#shorts"]
    }
  } catch (error: any) {
    console.error("Error trimming content:", error)
    
    // Handle rate limit specifically
    if (error?.status === 429) {
      return {
        formatted: "🚨 Free Tier Limit Reached\n\n• Daily generation quota exceeded\n• Platform optimization unavailable\n• Your content is preserved below\n\n" + content.substring(0, 200) + "...",
        hashtags: ["#freetier", "#quota", "#upgrade", "#premium", "#preserved"]
      }
    }
    
    return {
      formatted: "🎯 WATCH THIS: " + content.substring(0, 100) + "...",
      hashtags: ["#viral", "#trending", "#content", "#fyp", "#shorts"]
    }
  }
}