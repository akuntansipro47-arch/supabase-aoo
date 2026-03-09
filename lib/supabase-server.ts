import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with fallback
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found, using mock client')
    // Return a mock client that won't fail
    return createMockClient()
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Mock client for when Supabase is not available
function createMockClient() {
  return {
    from: (table: string) => ({
      select: (columns = '*') => ({
        limit: (limit = 50) => ({
          eq: (column: string, value: any) => ({
            order: (column: string, options?: any) => ({
              then: (resolve: Function) => resolve({ data: [], error: null })
            })
          }),
          then: (resolve: Function) => resolve({ data: [], error: null })
        })
      }),
      insert: (data: any) => ({
        select: () => ({
          then: (resolve: Function) => resolve({ data: null, error: { message: 'Mock client - insert not available' } })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: (resolve: Function) => resolve({ error: null })
        })
      })
    })
  } as any
}

// Client-side Supabase client
export function createClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found, using mock client')
    return createMockClient()
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
