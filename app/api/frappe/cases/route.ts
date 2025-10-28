import { NextRequest, NextResponse } from 'next/server'

// Disable all caching for fresh data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fields = searchParams.get('fields')
    const filters = searchParams.get('filters')
    const limit = searchParams.get('limit')
    
    // Build the Frappe API URL
    let frappeUrl = 'https://dev2.crimescan.ai/api/resource/CCMS2'
    const params = new URLSearchParams()
    
    if (fields) params.append('fields', fields)
    if (filters) params.append('filters', filters)
    if (limit) params.append('limit', limit)
    
    if (params.toString()) {
      frappeUrl += '?' + params.toString()
    }
    
    const response = await fetch(frappeUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Accept': 'application/json, text/plain, */*',
      },
      cache: 'no-store',
    })

    const contentType = response.headers.get('content-type') || ''
    const rawBody = await response.text()
    let data: any = rawBody
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(rawBody)
      } catch (_) {
        // leave data as raw text
      }
    }
    
    // Forward the response with cookies, preserving upstream status
    const nextResponse = contentType.includes('application/json')
      ? NextResponse.json(data, { status: response.status })
      : new NextResponse(rawBody, { status: response.status, headers: { 'content-type': contentType || 'text/plain' } })
    nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    
    // Copy cookies from Frappe response to Next.js response
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader)
    }
    
    return nextResponse
  } catch (error) {
    console.error('Error fetching cases:', error)
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
  }
}

