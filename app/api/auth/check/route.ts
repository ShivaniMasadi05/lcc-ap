import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://dev2.crimescan.ai/api/method/frappe.auth.get_logged_user', {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    const data = await response.json()
    
    // Forward the response with cookies
    const nextResponse = NextResponse.json(data)
    
    // Copy cookies from Frappe response to Next.js response
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader)
    }
    
    return nextResponse
  } catch (error) {
    return NextResponse.json({ error: 'Authentication check failed' }, { status: 500 })
  }
}

