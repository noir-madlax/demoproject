'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Send, LogOut, Bot, User, History, Settings } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface LLMRecord {
  id: number
  input_text: string
  output_text: string
  created_at: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [promptType, setPromptType] = useState('default')
  const [templateType, setTemplateType] = useState('question')
  const [showHistory, setShowHistory] = useState(false)
  const [llmRecords, setLlmRecords] = useState<LLMRecord[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const router = useRouter()

  // Prompt类型选项
  const promptTypes = [
    { value: 'default', label: 'Default Assistant' },
    { value: 'creative', label: 'Creative Assistant' },
    { value: 'technical', label: 'Technical Assistant' },
    { value: 'casual', label: 'Casual Assistant' }
  ]

  // 模板类型选项
  const templateTypes = [
    { value: 'question', label: 'Question' },
    { value: 'explain', label: 'Explain' },
    { value: 'summarize', label: 'Summarize' },
    { value: 'translate', label: 'Translate' },
    { value: 'code', label: 'Code Help' },
    { value: 'creative', label: 'Creative Task' }
  ]

  useEffect(() => {
    // 检查用户认证状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)
    }

    checkUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/auth')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // 获取LLM历史记录
  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch('/api/llm?limit=20')
      const data = await response.json()
      
      if (data.success) {
        setLlmRecords(data.records)
      } else {
        console.error('Failed to fetch history:', data.error)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  // 切换历史记录显示
  const toggleHistory = () => {
    setShowHistory(!showHistory)
    if (!showHistory && llmRecords.length === 0) {
      fetchHistory()
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          promptType,
          templateType
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        
        // 如果正在显示历史记录，刷新它
        if (showHistory) {
          fetchHistory()
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">AI Chat Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleHistory}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <History className="h-4 w-4" />
                <span>{showHistory ? 'Hide History' : 'Show History'}</span>
              </button>
              <span className="text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 聊天区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 配置选项 */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prompt Type
                    </label>
                    <select
                      value={promptType}
                      onChange={(e) => setPromptType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {promptTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Type
                    </label>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {templateTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 聊天消息区域 */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Start a conversation with AI</p>
                    <p className="text-sm mt-2">
                      Using: {promptTypes.find(p => p.value === promptType)?.label} + {templateTypes.find(t => t.value === templateType)?.label}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        message.role === 'user' ? 'bg-blue-500' : 'bg-gray-500'
                      } rounded-full p-2`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-gray-500 rounded-full p-2">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 输入区域 */}
              <div className="border-t bg-gray-50 p-4">
                <div className="flex space-x-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 历史记录侧边栏 */}
          {showHistory && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Database Records
                  </h3>
                </div>
                <div className="h-96 overflow-y-auto">
                  {loadingHistory ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : llmRecords.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No records found</div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {llmRecords.map((record) => (
                        <div key={record.id} className="border-b border-gray-200 pb-4">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Input:
                          </div>
                          <div className="text-sm text-gray-600 mb-2 bg-blue-50 p-2 rounded">
                            {record.input_text}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Output:
                          </div>
                          <div className="text-sm text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                            {record.output_text}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(record.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 border-t">
                  <button
                    onClick={fetchHistory}
                    disabled={loadingHistory}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {loadingHistory ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 