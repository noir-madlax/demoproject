import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// 类型定义，根据实际数据库结构调整
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      llm_records: {
        Row: {
          id: number // int8 类型
          input_text: string // text 类型
          output_text: string // text 类型  
          created_at: string // timestamptz 类型
        }
        Insert: {
          input_text: string
          output_text: string
          created_at?: string // 可选，数据库会自动生成
        }
        Update: {
          id?: number
          input_text?: string
          output_text?: string
          created_at?: string
        }
      }
    }
  }
}

// LLM记录相关的数据库操作函数
export const llmRecordsService = {
  // 创建新的LLM记录
  async create(input_text: string, output_text: string) {
    const { data, error } = await supabase
      .from('llm_records')
      .insert({
        input_text,
        output_text,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating LLM record:', error)
      throw error
    }

    return data
  },

  // 获取所有LLM记录
  async getAll(limit: number = 50) {
    const { data, error } = await supabase
      .from('llm_records')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching LLM records:', error)
      throw error
    }

    return data
  },

  // 根据ID获取单个记录
  async getById(id: number) {
    const { data, error } = await supabase
      .from('llm_records')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching LLM record:', error)
      throw error
    }

    return data
  },

  // 删除记录
  async delete(id: number) {
    const { error } = await supabase
      .from('llm_records')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting LLM record:', error)
      throw error
    }

    return true
  }
} 