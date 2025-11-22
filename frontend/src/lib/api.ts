/**
 * API client for PowerMonitor backend
 * Handles all GET requests to the FastAPI server
 */

// Determine the base URL based on environment
const getBaseUrl = (): string => {
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8001/api'
  }
  // Production URL
  return 'https://powermonitor.app/api'
}

const BASE_URL = getBaseUrl()

/**
 * Generic fetch wrapper for GET requests
 */
async function get<T>(endpoint: string, params?: Record<string, string | number | Date>): Promise<T> {
  const url = new URL(endpoint, BASE_URL)
  
  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Format dates as YYYY-MM-DD
        if (value instanceof Date) {
          url.searchParams.append(key, value.toISOString().split('T')[0])
        } else {
          url.searchParams.append(key, String(value))
        }
      }
    })
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get outages for a date range
 * @param startDate - Start date for the range
 * @param endDate - End date for the range
 */
export async function getOutagesByDateRange(
  startDate: Date | string,
  endDate: Date | string
): Promise<any> {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  return get('/outages', {
    start_date: start,
    end_date: end,
  })
}

/**
 * Get outages for a specific date
 * @param date - Date to get outages for
 */
export async function getOutagesByDate(date: Date | string): Promise<any> {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return get('/outages', {
    date: dateObj,
  })
}

// Export the base URL for reference if needed
export { BASE_URL }

