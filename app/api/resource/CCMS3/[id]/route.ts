import { NextRequest, NextResponse } from 'next/server'

// Disable all caching for fresh data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id
    
    const response = await fetch(`https://dev2.crimescan.ai/api/resource/CCMS3/${caseId}`, {
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
      } catch (_) {}
    }
    
    // Forward the response with cookies
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
    console.error('Error fetching CCMS3 case:', error)
    return NextResponse.json({ error: 'Failed to fetch CCMS3 case' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id
    const body = await request.text()
    
    const response = await fetch(`https://dev2.crimescan.ai/api/resource/CCMS3/${caseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'X-Frappe-CSRF-Token': request.headers.get('x-frappe-csrf-token') || '',
      },
      body: body,
      cache: 'no-store',
    })

    const contentType2 = response.headers.get('content-type') || ''
    const rawBody2 = await response.text()
    let data2: any = rawBody2
    if (contentType2.includes('application/json')) {
      try { data2 = JSON.parse(rawBody2) } catch (_) {}
    }
    
    // Forward the response with cookies
    const nextResponse = contentType2.includes('application/json')
      ? NextResponse.json(data2, { status: response.status })
      : new NextResponse(rawBody2, { status: response.status, headers: { 'content-type': contentType2 || 'text/plain' } })
    nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    
    // Copy cookies from Frappe response to Next.js response
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader)
    }
    
    return nextResponse
  } catch (error) {
    console.error('Error updating CCMS3 case:', error)
    return NextResponse.json({ error: 'Failed to update CCMS3 case' }, { status: 500 })
  }
}

