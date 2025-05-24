'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Database, MessageSquare, Zap, Shield } from 'lucide-react'
import EnvCheck from '@/components/EnvCheck'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* 头部区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Next.js Supabase App
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern full-stack application built with Next.js 14, Supabase, and OpenRouter integration
        </p>
      </div>

      {/* 功能卡片网格 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Database className="h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Supabase Database</h3>
          <p className="text-gray-600 text-sm">
            Real-time database with built-in authentication and row-level security
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <MessageSquare className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">OpenRouter AI</h3>
          <p className="text-gray-600 text-sm">
            Access to multiple LLM models through OpenRouter API integration
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Zap className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Next.js 14</h3>
          <p className="text-gray-600 text-sm">
            Latest Next.js with App Router, Server Components, and Server Actions
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Shield className="h-12 w-12 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Vercel Deploy</h3>
          <p className="text-gray-600 text-sm">
            Optimized for deployment on Vercel with automatic preview deployments
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="text-center space-x-4">
        <Link
          href="/auth"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/dashboard"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Dashboard
        </Link>
      </div>

      {/* 状态指示 */}
      <div className="mt-12 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 text-center">
          ✅ Project successfully initialized and ready for development
        </p>
      </div>

      {/* 开发环境下显示环境变量检查 */}
      <EnvCheck />
    </main>
  )
} 