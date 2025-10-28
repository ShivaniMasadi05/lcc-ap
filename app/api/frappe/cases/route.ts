import { NextRequest, NextResponse } from 'next/server'

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
      },
    })

    const data = await response.json()
    
    // Forward the response with cookies
    const nextResponse = NextResponse.json(data, { status: response.status })
    
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

