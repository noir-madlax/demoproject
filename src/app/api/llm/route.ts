import { NextRequest, NextResponse } from 'next/server'
import { createChatCompletion, AI_MODELS } from '@/lib/openrouter'
import { llmRecordsService } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

// 读取prompt配置
function getPromptConfig() {
  try {
    const promptsPath = path.join(process.cwd(), 'public', 'prompts.json')
    const promptsContent = fs.readFileSync(promptsPath, 'utf-8')
    return JSON.parse(promptsContent)
  } catch (error) {
    console.error('Error reading prompts.json:', error)
    // 返回默认配置
    return {
      systemPrompts: {
        default: "You are a helpful AI assistant. Please provide accurate, helpful, and well-structured responses to user questions."
      },
      userPromptTemplates: {
        question: "Please answer this question: {input}"
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      model = AI_MODELS.GPT_3_5_TURBO,
      promptType = 'default',
      templateType = 'question'
    } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // 读取prompt配置
    const promptConfig = getPromptConfig()
    
    // 获取系统prompt
    const systemPrompt = promptConfig.systemPrompts[promptType] || promptConfig.systemPrompts.default
    
    // 获取用户prompt模板
    const userTemplate = promptConfig.userPromptTemplates[templateType] || promptConfig.userPromptTemplates.question
    
    // 替换模板中的变量
    const formattedUserPrompt = userTemplate.replace('{input}', message)

    // 构建消息数组
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: formattedUserPrompt }
    ]

    console.log('Sending request to OpenRouter:', { model, messages })

    // 调用OpenRouter API
    const response = await createChatCompletion(messages, model)
    
    const aiResponse = response.choices[0]?.message?.content || 'No response generated'

    console.log('Received response from OpenRouter:', { aiResponse })

    // 记录到数据库
    try {
      const dbRecord = await llmRecordsService.create(message, aiResponse)
      console.log('Saved to database:', dbRecord)
    } catch (dbError) {
      console.error('Database save error:', dbError)
      // 即使数据库保存失败，也返回AI响应
    }

    return NextResponse.json({
      success: true,
      message: aiResponse,
      input: message,
      promptType,
      templateType,
      model,
      usage: response.usage,
    })
  } catch (error: any) {
    console.error('LLM API error:', error)
    
    // 如果有输入消息，尝试记录错误到数据库
    try {
      const body = await request.json().catch(() => ({}))
      if (body.message) {
        await llmRecordsService.create(body.message, `Error: ${error.message}`)
      }
    } catch (dbError) {
      console.error('Error recording error to database:', dbError)
    }

    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to process LLM request',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // 获取LLM记录
    const records = await llmRecordsService.getAll(limit)
    
    return NextResponse.json({
      success: true,
      records,
      count: records.length
    })
  } catch (error: any) {
    console.error('Error fetching LLM records:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch LLM records',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 