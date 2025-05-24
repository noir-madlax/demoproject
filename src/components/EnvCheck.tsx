// 环境变量检查组件 - 仅用于开发环境
'use client'

export default function EnvCheck() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">环境变量状态</h4>
      <div className="space-y-1">
        <div className={`flex items-center ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}`}>
          <span className="mr-2">{process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</span>
          SUPABASE_URL
        </div>
        <div className={`flex items-center ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-400' : 'text-red-400'}`}>
          <span className="mr-2">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}</span>
          SUPABASE_ANON_KEY
        </div>
        <div className="flex items-center text-yellow-400">
          <span className="mr-2">🔑</span>
          OPENROUTER_API_KEY (服务端)
        </div>
      </div>
    </div>
  )
} 