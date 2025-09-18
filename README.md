# HookGenie ✨

Transform your scripts into viral hooks with AI magic.

## Features

- **AI-Powered Hook Generation**: Uses Google Gemini to create 3 viral, scroll-stopping hooks
- **Modern Glassmorphism UI**: Beautiful, minimalist design with purple accents
- **Copy to Clipboard**: One-click copying of generated hooks
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode Support**: Automatic theme switching

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Lucide Icons
```bash
npm install lucide-react
```

### 3. Set up Google Gemini API
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see HookGenie in action!

## How It Works

1. **Paste your script** in the large textarea
2. **Click "✨ Genie It"** to generate viral hooks
3. **Copy any hook** with a single click
4. **Use in your content** for maximum engagement

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Google Gemini AI** for hook generation
- **Lucide React** for icons

## Deploy

Easily deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hookgenie)

Don't forget to add your `GEMINI_API_KEY` to Vercel environment variables!

---

**Made with ✨ by HookGenie** - v1.0.1
