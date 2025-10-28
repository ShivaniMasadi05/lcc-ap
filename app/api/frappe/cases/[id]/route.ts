import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id
    
    const response = await fetch(`https://dev2.crimescan.ai/api/resource/CCMS2/${caseId}`, {
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
    console.error('Error fetching case:', error)
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id
    const body = await request.text()
    
    const response = await fetch(`https://dev2.crimescan.ai/api/resource/CCMS2/${caseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'X-Frappe-CSRF-Token': request.headers.get('x-frappe-csrf-token') || '',
      },
      body: body,
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
    console.error('Error updating case:', error)
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 })
  }
}

