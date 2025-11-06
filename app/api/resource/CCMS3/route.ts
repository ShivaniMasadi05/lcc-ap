import { NextRequest, NextResponse } from 'next/server'

// Cache for count queries (limit=0) - these are less critical to be fresh
const countCache = new Map<string, { data: any; timestamp: number }>()
const COUNT_CACHE_TTL = 30000 // 30 seconds cache for count queries

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fields = searchParams.get('fields')
    const filters = searchParams.get('filters')
    const limit = searchParams.get('limit')
    const limitStart = searchParams.get('limit_start')
    
    // Check cache for count queries (limit=0) - these can be cached briefly
    const isCountQuery = limit === '0'
    if (isCountQuery) {
      const cacheKey = `${filters || ''}-${limit || ''}`
      const cached = countCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < COUNT_CACHE_TTL) {
        console.log('Returning cached count query result')
        return NextResponse.json(cached.data, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
          }
        })
      }
    }
    
    // Build the Frappe API URL
    let frappeUrl = 'https://dev2.crimescan.ai/api/resource/CCMS3'
    const params = new URLSearchParams()
    
    if (fields) params.append('fields', fields)
    if (filters) params.append('filters', filters)
    if (limit) params.append('limit', limit)
    if (limitStart) params.append('limit_start', limitStart)
    
    if (params.toString()) {
      frappeUrl += '?' + params.toString()
    }
    
    // Use AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const response = await fetch(frappeUrl, {
        method: 'GET',
        headers: {
          'Cookie': request.headers.get('cookie') || '',
          'Accept': 'application/json, text/plain, */*',
          'Connection': 'keep-alive', // Reuse connections
        },
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        // Cache count queries
        if (isCountQuery) {
          const cacheKey = `${filters || ''}-${limit || ''}`
          countCache.set(cacheKey, { data, timestamp: Date.now() })
          // Clean old cache entries periodically
          if (countCache.size > 100) {
            const now = Date.now()
            Array.from(countCache.entries()).forEach(([key, value]) => {
              if (now - value.timestamp > COUNT_CACHE_TTL) {
                countCache.delete(key)
              }
            })
          }
        }
        
        const nextResponse = NextResponse.json(data, { status: response.status });
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
          nextResponse.headers.set('set-cookie', setCookieHeader);
        }
        
        // Set appropriate cache headers
        if (isCountQuery) {
          nextResponse.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
          nextResponse.headers.set('X-Cache', 'MISS');
        } else {
          nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        }
        
        return nextResponse;
      } else {
        const text = await response.text();
        const nextResponse = new NextResponse(text, { 
          status: response.status, 
          headers: { 'Content-Type': contentType || 'text/plain' } 
        });
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
          nextResponse.headers.set('set-cookie', setCookieHeader);
        }
        nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return nextResponse;
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout fetching CCMS3 data')
        return NextResponse.json({ error: 'Request timeout' }, { status: 504 })
      }
      throw fetchError
    }
  } catch (error) {
    console.error('Error fetching CCMS3 data:', error)
    return NextResponse.json({ error: 'Failed to fetch CCMS3 data' }, { status: 500 })
  }
}

