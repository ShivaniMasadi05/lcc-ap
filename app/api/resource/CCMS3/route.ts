import { NextRequest, NextResponse } from 'next/server'

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
    
    const response = await fetch(frappeUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Accept': 'application/json, text/plain, */*',
      },
      cache: 'no-store',
    })

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      const nextResponse = NextResponse.json(data, { status: response.status });
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        nextResponse.headers.set('set-cookie', setCookieHeader);
      }
      nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
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
  } catch (error) {
    console.error('Error fetching CCMS3 data:', error)
    return NextResponse.json({ error: 'Failed to fetch CCMS3 data' }, { status: 500 })
  }
}

