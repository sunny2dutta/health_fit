const API_BASE_URL = 'http://localhost:3000'

async function testAPI() {
  try {
    // Test fetching users via API
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer admin-secret-token',
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch users')
    }

    console.log('✅ Users fetched via API:', result)

  } catch (error) {
    console.error('❌ Error using API:', error.message)
  }
}

testAPI()

