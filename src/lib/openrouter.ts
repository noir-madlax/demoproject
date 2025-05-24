import OpenAI from 'openai'

// 创建OpenRouter客户端，使用OpenAI兼容的接口
export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Next.js Supabase App',
  },
})

// 常用的AI模型配置
export const AI_MODELS = {
  GPT_4_TURBO: 'openai/gpt-4-turbo',
  GPT_3_5_TURBO: 'openai/gpt-3.5-turbo',
  CLAUDE_HAIKU: 'anthropic/claude-3-haiku',
  CLAUDE_SONNET: 'anthropic/claude-3-sonnet',
  LLAMA_3_8B: 'meta-llama/llama-3-8b-instruct',
  GEMINI_PRO: 'google/gemini-pro',
} as const

// 聊天完成函数
export async function createChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  model: string,
  options?: {
    temperature?: number
    max_tokens?: number
    stream?: boolean
  }
) {
  try {
    const response = await openrouter.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.max_tokens || 1000,
      stream: options?.stream || false,
    })

    return response
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw error
  }
}

// generateText 函数及其注释将被删除 